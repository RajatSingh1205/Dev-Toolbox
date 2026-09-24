import React, { useState } from 'react'
import CodeEditor from "./CodeEditor.jsx";
import GenerateButton from "./GenerateButton.jsx";

function Conversions() {
    const [json, setJson] = useState(`–`);

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(json);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-center items-center ">
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

                        <CodeEditor
                            value={json}
                            onChange={setJson}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center ">
                <GenerateButton
                    json={json}
                />
            </div>

        </>

    )
}

export default Conversions