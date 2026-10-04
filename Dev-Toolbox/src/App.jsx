import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Conversions from "./components/Conversions.jsx";
import ViewJson from "./components/ViewJson.jsx";
import LinkHistory from "./components/LinkHistory.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./components/Landing.jsx";

function EditorPage() {
    // bumped whenever a link is created so the history list refreshes
    const [historyVersion, setHistoryVersion] = useState(0);

    return (
        <div className="bg-black text-white min-h-screen pb-20">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28">
                <header className="text-center max-w-2xl mx-auto mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Format, validate &amp; share JSON
                    </h1>
                    <p className="mt-3 text-gray-400">
                        Paste your JSON, clean it up, and generate a shareable link that expires when you want it to.
                    </p>
                </header>

                <Conversions onCreated={() => setHistoryVersion((v) => v + 1)} />
                <LinkHistory refreshKey={historyVersion} />
            </main>
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/json/:id" element={<ViewJson />} />
        </Routes>
    )
}

export default App
