import React, { useCallback, useEffect, useState } from "react";
import { Copy, Check, ExternalLink, Trash2, Clock, KeyRound } from "lucide-react";
import { api, copyText, getSessionId, setSessionId, parseServerDate } from "../lib/api.js";

function useNow(intervalMs = 1000) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(t);
    }, [intervalMs]);
    return now;
}

function timeAgo(iso, now) {
    const s = Math.max(0, (now - parseServerDate(iso).getTime()) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

function expiryText(link, expired) {
    if (!link.expiresAt) return "Never expires";
    const d = parseServerDate(link.expiresAt).toLocaleString();
    return expired ? `Expired ${d}` : `Expires ${d}`;
}

function HistoryItem({ link, onRemove, now }) {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/json/${link.jsonShareId}`;
    const expired =
        link.status === "EXPIRED" ||
        (link.expiresAt && parseServerDate(link.expiresAt).getTime() <= now);
    const active = !expired;

    const copy = async () => {
        if (await copyText(url)) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
    };

    return (
        <li className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-white">{link.name}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${active ? "bg-green-500/15 text-green-400" : "bg-gray-800 text-gray-400"}`}>
                        {active ? "Active" : "Expired"}
                    </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} /> Created {timeAgo(link.createdAt, now)} · {expiryText(link, expired)}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                {active && (
                    <>
                        <button onClick={copy} aria-label="Copy link" className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white cursor-pointer">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <a href={url} target="_blank" rel="noreferrer" aria-label="Open link" className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-white">
                            <ExternalLink size={16} />
                        </a>
                    </>
                )}
                <button onClick={() => onRemove(link.id)} aria-label="Remove from history" className="rounded-lg p-2 text-gray-400 hover:bg-gray-900 hover:text-red-400 cursor-pointer">
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    );
}

function LinkHistory({ refreshKey = 0 }) {
    const [links, setLinks] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ok | error
    const [showSession, setShowSession] = useState(false);
    const [restoreValue, setRestoreValue] = useState("");
    const [restoreError, setRestoreError] = useState(false);
    const [sessionCopied, setSessionCopied] = useState(false);

    const load = useCallback(async () => {
        try {
            setLinks(await api("/api/links/history"));
            setStatus("ok");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }, []);

    useEffect(() => { load(); }, [load, refreshKey]);

    const removeOne = async (id) => {
        setLinks((prev) => prev.filter((l) => l.id !== id)); // optimistic
        try { await api(`/api/links/history/${id}`, { method: "DELETE" }); } catch { load(); }
    };

    const clearAll = async () => {
        if (!window.confirm("Remove all links from this history? Existing shared links keep working until they expire.")) return;
        setLinks([]);
        try { await api("/api/links/history", { method: "DELETE" }); } catch { load(); }
    };

    const restore = () => {
        if (setSessionId(restoreValue)) {
            setRestoreError(false); setRestoreValue(""); setShowSession(false); setStatus("loading"); load();
        } else setRestoreError(true);
    };

    const now = useNow(1000);
    const sessionId = getSessionId();

    return (
        <section id="history" className="mt-16 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your link history</h2>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowSession((v) => !v)} className="flex items-center gap-1.5 rounded-lg border border-gray-800 px-3 py-1.5 text-xs text-gray-400 hover:text-white cursor-pointer">
                        <KeyRound size={13} /> Session
                    </button>
                    {links.length > 0 && (
                        <button onClick={clearAll} className="rounded-lg border border-gray-800 px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 cursor-pointer">
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {showSession && (
                <div className="mb-4 rounded-xl border border-gray-800 bg-gray-950 p-4 text-sm">
                    <p className="text-gray-400">
                        No account needed. Your history is tied to this session code, stored in this browser.
                        Use it to see the same history on another device.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <code className="flex-1 truncate rounded-lg bg-black px-3 py-2 text-xs text-gray-300">{sessionId}</code>
                        <button
                            onClick={async () => { if (await copyText(sessionId)) { setSessionCopied(true); setTimeout(() => setSessionCopied(false), 1500); } }}
                            className="rounded-lg bg-purple-300 px-3 py-2 text-xs text-black cursor-pointer"
                        >
                            {sessionCopied ? "Copied" : "Copy"}
                        </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <input
                            value={restoreValue}
                            onChange={(e) => { setRestoreValue(e.target.value); setRestoreError(false); }}
                            placeholder="Paste a session code to switch to it"
                            className="flex-1 rounded-lg border border-gray-800 bg-black px-3 py-2 text-xs text-white outline-none focus:border-purple-400"
                        />
                        <button onClick={restore} className="rounded-lg border border-gray-700 px-3 py-2 text-xs text-gray-200 hover:text-white cursor-pointer">Restore</button>
                    </div>
                    {restoreError && <p className="mt-2 text-xs text-red-400">That isn't a valid session code.</p>}
                </div>
            )}

            {status === "loading" && (
                <ul className="space-y-3">
                    {[0, 1, 2].map((i) => <li key={i} className="h-[66px] animate-pulse rounded-xl border border-gray-800 bg-gray-950" />)}
                </ul>
            )}

            {status === "error" && (
                <p className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
                    Couldn't load your history. Is the backend running?{" "}
                    <button onClick={load} className="underline cursor-pointer">Retry</button>
                </p>
            )}

            {status === "ok" && links.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-800 px-4 py-10 text-center text-sm text-gray-500">
                    No links yet. Generate one above and it will show up here.
                </div>
            )}

            {status === "ok" && links.length > 0 && (
                <ul className="space-y-3">
                    {links.map((link) => <HistoryItem key={link.id} link={link} onRemove={removeOne} now={now} />)}
                </ul>
            )}
        </section>
    );
}

export default LinkHistory;
