import React, { useState } from "react";
import ExpirationCard from "./ExpirationCard.jsx";

function GenerateButton({json}) {
    const handleGeneration = async (expiration) => {
        const response = await fetch(
            `http://localhost:8080/api/json/create?expirationMinutes=${expiration}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: json
            }
        );
        const data = await response.json();

        console.log(data);
    }

    const [showExpiration, setShowExpiration] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowExpiration(true)}
                className="bg-purple-300 text-black h-15 w-100 my-10 border rounded-2xl"
            >
                Generate Link
            </button>

            {showExpiration && (
                <ExpirationCard
                    onCancel={() => setShowExpiration(false)}
                    onGenerate={(expiration) => {
                        console.log(expiration);
                        setShowExpiration(false);
                    }}
                />
            )}
        </>
    );
}

export default GenerateButton;