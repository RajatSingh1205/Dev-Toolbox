import React, { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import ExpirationCard from "./ExpirationCard.jsx";
import { api, copyText } from "../lib/api.js";

// Maps each preset option shown in ExpirationCard to minutes.
// "Never" resolves to null, which means "no expirationMinutes param at all".
const PRESET_MINUTES = {
    "10 Minutes": 10,
    "1 Hour": 60,
    "1 Day": 60 * 24,
    "7 Days": 60 * 24 * 7,
    "Never": null,
};

const UNIT_TO_MINUTES = {
    Minutes: 1,
    Hours: 60,
    Days: 60 * 24,
    Weeks: 60 * 24 * 7,
};

function resolveExpirationMinutes(selection) {
    if (selection.type === "preset") {
        return PRESET_MINUTES[selection.value] ?? null;
    }

    // Custom: value * unit
    const multiplier = UNIT_TO_MINUTES[selection.unit] ?? 1;
    const minutes = Number(selection.value) * multiplier;

    return Number.isFinite(minutes) && minutes > 0 ? minutes : null;
}

function GenerateButton({ json, valid = true, onCreated }) {
    const [showExpiration, setShowExpiration] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGeneration = async (expirationMinutes, name) => {
        setIsGenerating(true);
        setError(null);

        try {
            const params = new URLSearchParams({ name: name?.trim() || "Untitled" });
            if (expirationMinutes != null) params.set("expirationMinutes", expirationMinutes);

            const data = await api(`/api/json/create?${params}`, { method: "POST", body: json });
            setGeneratedUrl(data.url);
            onCreated?.();
        } catch (err) {
            console.error("Failed to generate link:", err);
            setError("Couldn't generate a link. Is the backend running?");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyLink = async () => {
        if (generatedUrl && (await copyText(generatedUrl))) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
            <button
                onClick={() => { setError(null); setShowExpiration(true); }}
                disabled={isGenerating || !valid}
                title={valid ? "" : "Fix the JSON errors first"}
                className="w-full max-w-md rounded-2xl bg-purple-300 py-4 font-medium text-black transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
                {isGenerating ? "Generating..." : "Generate Link"}
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {generatedUrl && (
                <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3">
                    <input readOnly value={generatedUrl} className="flex-1 truncate bg-transparent text-sm text-gray-200 outline-none" />
                    <button onClick={handleCopyLink} className="shrink-0 rounded-lg bg-purple-300 p-2 text-black cursor-pointer" aria-label="Copy link">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <a href={generatedUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-gray-700 p-2 text-gray-300 hover:text-white" aria-label="Open link">
                        <ExternalLink size={14} />
                    </a>
                </div>
            )}

            {showExpiration && (
                <ExpirationCard
                    onCancel={() => setShowExpiration(false)}
                    onGenerate={(selection) => {
                        const expirationMinutes = resolveExpirationMinutes(selection);
                        setShowExpiration(false);
                        handleGeneration(expirationMinutes, selection.name);
                    }}
                />
            )}
        </div>
    );
}

export default GenerateButton;
