import React from "react";
import { Link } from "react-router-dom";
import { Braces } from "lucide-react";

const Navbar = () => (
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-white">
                <span className="grid place-items-center h-8 w-8 rounded-lg bg-purple-300 text-black">
                    <Braces size={18} />
                </span>
                <span className="text-xl font-bold tracking-tight">Dev Toolbox</span>
            </Link>

            <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link to="/" className="hover:text-white transition">JSON Share</Link>
                <a href="/#history" className="hover:text-white transition">History</a>
            </div>
        </div>
    </nav>
);

export default Navbar;
