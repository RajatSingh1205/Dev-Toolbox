import React from "react";

function Listbox() {
    return (
        <div className="w-40">
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Select format
            </label>

            <select
                className="
                    w-full
                    rounded-xl
                    border border-white/15
                    bg-white/10
                    backdrop-blur-xl
                    px-4 py-2
                    text-sm
                    text-white
                    shadow-lg shadow-black/20
                    outline-none
                    transition-all duration-200
                    hover:bg-white/15
                    focus:border-white/30
                    focus:bg-white/15
                    focus:ring-2
                    focus:ring-white/10
                "
            >
                <option className="bg-gray-900 text-white" value="json">
                    JSON
                </option>

                <option className="bg-gray-900 text-white" value="xml">
                    XML
                </option>

                <option className="bg-gray-900 text-white" value="yaml">
                    YAML
                </option>

                <option className="bg-gray-900 text-white" value="pojo">
                    POJO
                </option>
            </select>
        </div>
    );
}

export default Listbox;