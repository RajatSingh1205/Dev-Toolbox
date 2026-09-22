import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor.jsx";

function formatExpiry(expiresAt) {
    if (!expiresAt) return "Never expires";

    const date = new Date(expiresAt);
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
                    `http://localhost:8085/api/json/${id}`
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
        try {
            await navigator.clipboard.writeText(payload);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <div className="text-4xl pt-6 font-bold flex flex-row justify-center mb-8">
                <Link to="/">Dev Toolbox</Link>
            </div>

            {status === "loading" && (
                <p className="text-center text-gray-400">Loading shared JSON...</p>
            )}

            {status === "not_found" && (
                <div className="flex flex-col items-center gap-4 mt-10">
                    <p className="text-xl">This link doesn't exist or has expired.</p>
                    <Link
                        to="/"
                        className="bg-purple-300 text-black px-5 py-2.5 rounded-xl"
                    >
                        Share a new JSON
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div className="flex flex-col items-center gap-4 mt-10">
                    <p className="text-xl text-red-400">
                        Couldn't load this link. Is the backend running?
                    </p>
                </div>
            )}

            {status === "ok" && (
                <>
                    <div className="flex flex-row justify-center items-center">
                        <div className="flex flex-row justify-center items-center bg-black h-160 w-350">
                            <div className="bg-gray-950 h-130 w-250 mt-5 pl-5 pt-3 rounded-3xl">
                                <div className="flex flex-row items-center justify-between pr-8 mb-4">
                                    <div className="flex flex-row items-center ml-3 gap-2">
                                        <div className="h-3 w-3 bg-red-500 rounded-full" />
                                        <div className="h-3 w-3 bg-yellow-500 rounded-full" />
                                        <div className="h-3 w-3 bg-green-500 rounded-full" />
                                    </div>

                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center justify-center bg-black text-white w-18 h-8 rounded-md"
                                    >
                                        {copied ? "copied!" : "copy"}
                                    </button>
                                </div>

                                <CodeEditor value={payload} readOnly />
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-4">
                        {formatExpiry(expiresAt)}
                    </p>
                </>
            )}
        </div>
    );
}

export default ViewJson;
