import React, { useEffect, useState } from "react";

function LinkHistory() {

    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://localhost:8085/api/links/history")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch link history");
                }

                return response.json();
            })
            .then(data => {
                setLinks(data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <h1>Link History</h1>

            {links.map(link => (
                <div key={link.id}>

                    <h2>{link.name}</h2>

                    <p>
                        Created: {link.createdAt}
                    </p>

                    <p>
                        Expires: {link.expiresAt || "Never"}
                    </p>

                    <p>
                        Status: {link.status}
                    </p>

                </div>
            ))}

        </div>
    );
}

export default LinkHistory;