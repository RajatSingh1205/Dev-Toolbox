import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor.jsx";
import Navbar from "./Navbar.jsx";
import { API_BASE, copyText, parseServerDate } from "../lib/api.js";

function formatExpiry(expiresAt) {
    if (!expiresAt) return "Never expires";

    const date = parseServerDate(expiresAt);
    const isPast = date.getTime() < Date.now();

    return isPast
        ? `Expired ${date.toLocaleString()}`
        : `Expires ${date.toLocaleString()}`;
}

function ViewJson() {
    const { id } = useParams();

    const [payload, setPayload] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [status, setStatus] = useState("loading"); // loading | ok | not_found | error
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setStatus("loading");

            try {
                const response = await fetch(
                    `${API_BASE}/api/json/${id}`
                );

                if (cancelled) return;

                if (response.status === 404) {
                    setStatus("not_found");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();

                setPayload(data.payload);
                setExpiresAt(data.expiresAt);
                setStatus("ok");
            } catch (err) {
                console.error("Failed to load shared JSON:", err);
                if (!cancelled) setStatus("error");
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleCopy = async () => {
        if (!payload) return;
        if (await copyText(payload)) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen pb-16">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28">
                {status === "loading" && <p className="text-center text-gray-400">Loading shared JSON...</p>}

                {status === "not_found" && (
                    <div className="flex flex-col items-center gap-4 mt-10 text-center">
                        <p className="text-xl">This link doesn't exist or has expired.</p>
                        <Link to="/" className="rounded-xl bg-purple-300 px-5 py-2.5 text-black">Share a new JSON</Link>
                    </div>
                )}

                {status === "error" && (
                    <p className="mt-10 text-center text-xl text-red-400">Couldn't load this link. Is the backend running?</p>
                )}

                {status === "ok" && (
                    <>
                        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 ml-1">
                                    <span className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                                    <span className="h-3 w-3 rounded-full bg-green-500" />
                                </div>
                                <button onClick={handleCopy} className="rounded-lg border border-gray-800 bg-black px-3 py-1.5 text-xs text-gray-300 hover:text-white cursor-pointer">
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <div className="h-[65vh] min-h-[320px]">
                                <CodeEditor value={payload} readOnly />
                            </div>
                        </div>
                        <p className="mt-4 text-center text-sm text-gray-400">{formatExpiry(expiresAt)}</p>
                    </>
                )}
            </main>
        </div>
    );
}

export default ViewJson;
