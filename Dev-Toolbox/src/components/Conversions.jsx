import React, { useMemo, useState } from 'react'
import { Copy, Check, AlignLeft, Minimize2, Trash2, CircleCheck, CircleAlert } from "lucide-react";
import CodeEditor from "./CodeEditor.jsx";
import GenerateButton from "./GenerateButton.jsx";
import { copyText } from "../lib/api.js";

const SAMPLE = `{
  "name": "Dev Toolbox",
  "tags": ["json", "share"],
  "active": true
}`;

function ToolButton({ icon: Icon, children, ...props }) {
    return (
        <button
            {...props}
            className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-black px-3 py-1.5 text-xs text-gray-300 transition hover:border-gray-600 hover:text-white cursor-pointer"
        >
            <Icon size={14} /> <span className="hidden sm:inline">{children}</span>
        </button>
    );
}

function Conversions({ onCreated }) {
    const [json, setJson] = useState(SAMPLE);
    const [copied, setCopied] = useState(false);

    const validation = useMemo(() => {
        if (!json.trim()) return { ok: false, message: "Editor is empty" };
        try { JSON.parse(json); return { ok: true, message: "Valid JSON" }; }
        catch (e) { return { ok: false, message: e.message }; }
    }, [json]);

    const prettify = () => validation.ok && setJson(JSON.stringify(JSON.parse(json), null, 2));
    const minify = () => validation.ok && setJson(JSON.stringify(JSON.parse(json)));
    const handleCopy = async () => {
        if (await copyText(json)) { setCopied(true); setTimeout(() => setCopied(false), 1500); }
    };

    return (
        <section>
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 ml-1">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex items-center gap-2">
                        <ToolButton icon={AlignLeft} onClick={prettify} disabled={!validation.ok}>Prettify</ToolButton>
                        <ToolButton icon={Minimize2} onClick={minify} disabled={!validation.ok}>Minify</ToolButton>
                        <ToolButton icon={copied ? Check : Copy} onClick={handleCopy}>{copied ? "Copied" : "Copy"}</ToolButton>
                        <ToolButton icon={Trash2} onClick={() => setJson("")}>Clear</ToolButton>
                    </div>
                </div>

                <div className="h-[55vh] min-h-[320px] max-h-[520px]">
                    <CodeEditor value={json} onChange={(v) => setJson(v ?? "")} />
                </div>

                <div className={`mt-3 flex items-center gap-2 px-1 text-xs ${validation.ok ? "text-green-400" : "text-red-400"}`}>
                    {validation.ok ? <CircleCheck size={14} /> : <CircleAlert size={14} />}
                    <span className="truncate">{validation.message}</span>
                </div>
            </div>

            <GenerateButton json={json} valid={validation.ok} onCreated={onCreated} />
        </section>
    )
}

export default Conversions
