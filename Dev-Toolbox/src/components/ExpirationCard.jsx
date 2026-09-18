import React, { useState } from "react";

function ExpirationCard({ onCancel, onGenerate }) {

    const [selected, setSelected] = useState("1 Hour");

    const [customValue, setCustomValue] = useState(1);
    const [customUnit, setCustomUnit] = useState("Hours");

    const options = [
        "10 Minutes",
        "1 Hour",
        "1 Day",
        "7 Days",
        "Never",
        "Custom"
    ];

    const handleGenerate = () => {

        if (selected === "Custom") {
            onGenerate({
                type: "custom",
                value: customValue,
                unit: customUnit
            });

            return;
        }

        onGenerate({
            type: "preset",
            value: selected
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-105 rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">

                {/* Heading */}
                <h2 className="text-xl font-semibold text-white text-center">
                    How long should this link last?
                </h2>

                <p className="mt-2 text-sm text-gray-400 text-center">
                    Choose when this link should expire.
                </p>


                {/* Options */}
                <div className="grid grid-cols-2 gap-3 mt-6">

                    {options.map((option) => (

                        <button
                            key={option}
                            onClick={() => setSelected(option)}
                            className={`
                                rounded-xl
                                border
                                px-4
                                py-3
                                text-sm
                                transition-all
                                ${
                                selected === option
                                    ? "border-purple-400 bg-purple-400/20 text-purple-300"
                                    : "border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-600"
                            }
                            `}
                        >
                            {option}
                        </button>

                    ))}

                </div>


                {/* Custom duration */}
                {selected === "Custom" && (

                    <div className="mt-5">

                        <label className="block text-sm text-gray-400 mb-2">
                            Custom duration
                        </label>

                        <div className="flex gap-3">

                            <input
                                type="number"
                                min="1"
                                value={customValue}
                                onChange={(e) =>
                                    setCustomValue(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border border-gray-800
                                    bg-gray-900
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    focus:border-purple-400
                                "
                            />

                            <select
                                value={customUnit}
                                onChange={(e) =>
                                    setCustomUnit(e.target.value)
                                }
                                className="
                                    rounded-xl
                                    border border-gray-800
                                    bg-gray-900
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    focus:border-purple-400
                                "
                            >
                                <option>Minutes</option>
                                <option>Hours</option>
                                <option>Days</option>
                                <option>Weeks</option>
                            </select>

                        </div>

                    </div>

                )}


                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-7">

                    <button
                        onClick={onCancel}
                        className="
                            rounded-xl
                            px-5
                            py-2.5
                            text-sm
                            text-gray-400
                            hover:text-white
                            transition
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleGenerate}
                        className="
                            rounded-xl
                            bg-purple-300
                            px-5
                            py-2.5
                            text-sm
                            text-black
                            hover:bg-purple-200
                            transition
                        "
                    >
                        Generate
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ExpirationCard;