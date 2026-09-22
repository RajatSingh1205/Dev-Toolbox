import React, { useState } from "react";
import ExpirationCard from "./ExpirationCard.jsx";

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

function GenerateButton({ json }) {
    const [showExpiration, setShowExpiration] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleGeneration = async (expirationMinutes) => {
        setIsGenerating(true);
        setError(null);

        try {
            const query =
                expirationMinutes != null
                    ? `?expirationMinutes=${expirationMinutes}`
                    : "";

            const response = await fetch(
                `http://localhost:8085/api/json/create${query}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: json,
                }
            );

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            setGeneratedUrl(data.url);
        } catch (err) {
            console.error("Failed to generate link:", err);
            setError("Couldn't generate a link. Is the backend running?");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyLink = async () => {
        if (!generatedUrl) return;
        try {
            await navigator.clipboard.writeText(generatedUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={() => {
                    setError(null);
                    setShowExpiration(true);
                }}
                disabled={isGenerating}
                className="bg-purple-300 text-black h-15 w-100 my-10 border rounded-2xl disabled:opacity-60"
            >
                {isGenerating ? "Generating..." : "Generate Link"}
            </button>

            {error && (
                <p className="text-red-400 text-sm -mt-6 mb-6">{error}</p>
            )}

            {generatedUrl && (
                <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 mb-6 w-100">
                    <input
                        readOnly
                        value={generatedUrl}
                        className="bg-transparent text-sm text-gray-200 flex-1 outline-none truncate"
                    />
                    <button
                        onClick={handleCopyLink}
                        className="text-xs bg-purple-300 text-black rounded-lg px-3 py-1.5 shrink-0"
                    >
                        {copied ? "copied!" : "copy"}
                    </button>
                </div>
            )}

            {showExpiration && (
                <ExpirationCard
                    onCancel={() => setShowExpiration(false)}
                    onGenerate={(selection) => {
                        const expirationMinutes = resolveExpirationMinutes(selection);
                        setShowExpiration(false);
                        handleGeneration(expirationMinutes);
                    }}
                />
            )}
        </div>
    );
}

export default GenerateButton;
