import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Conversions from "./components/Conversions.jsx";
import ViewJson from "./components/ViewJson.jsx";

function EditorPage() {
    return (
        <div className="bg-black text-white min-h-screen ">
            <div className=" text-4xl  pt-6 font-bold flex flex-row justify-center mb-5">
                <h1>Dev Toolbox</h1>

            </div>
            <div className="flex flex-row justify-center text-center ">
                <div className=" w-100">
                    <p className="text-gray-400">
                        A simple developer utility for formatting, converting, and sharing JSON with ease. Generate shareable links with customizable expiration times, so your data stays available only as long as you need it.
                    </p>
                </div>
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
