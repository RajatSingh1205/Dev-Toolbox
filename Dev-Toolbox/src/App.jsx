import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Conversions from "./components/Conversions.jsx";
import ViewJson from "./components/ViewJson.jsx";

function EditorPage() {
    return (
        <div className="bg-black text-white min-h-screen ">
            <div className=" text-4xl  pt-6 font-bold flex flex-row justify-center mb-5">
                Dev Toolbox
            </div>

            <Conversions/>
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/json/:id" element={<ViewJson />} />
        </Routes>
    )
}

export default App
