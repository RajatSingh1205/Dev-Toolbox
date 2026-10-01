import React, {useState} from "react";
import {Link} from "react-router-dom";
import { Search, X} from "lucide-react";

const Navbar = ({ onLogin }) => {
    const [showSearch, setShowSearch] = useState(false);
    return (
        <>
            {/*<SearchBox*/}
            {/*    isOpen={showSearch}*/}
            {/*    onClose={() => setShowSearch(false)}*/}
            {/*/>*/}
            {/*{showSearch && (*/}
            {/*    <div*/}
            {/*        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-start justify-center pt-24"*/}
            {/*        onClick={() => setShowSearch(false)}*/}
            {/*    >*/}
            {/*        <div*/}
            {/*            className="bg-black/90 w-[600px] rounded-xl p-4 shadow-2xl border border-gray-700"*/}
            {/*            onClick={(e) => e.stopPropagation()}*/}
            {/*        >*/}
            {/*            <div className="flex items-center gap-3">*/}
            {/*                <Search className="text-gray-400" />*/}

            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    placeholder="Search movies..."*/}
            {/*                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"*/}
            {/*                    autoFocus*/}
            {/*                />*/}

            {/*                <button onClick={() => setShowSearch(false)}>*/}
            {/*                    <X className="text-white cursor-pointer" />*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
            <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

                    {/* Logo */}
                    <h1 className="text-3xl font-bold text-white cursor-pointer">
                        Trail
                    </h1>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 text-gray-300">
                        <Link to="/Home">
                            <button className="hover:text-white transition cursor-pointer">
                                Home
                            </button>
                        </Link>

                        <button className="hover:text-white transition cursor-pointer">
                            Popular
                        </button>

                        <button className="hover:text-white transition cursor-pointer">
                            Lists
                        </button>
                    </div>

                    {/* Login Button */}
                    <div className="flex flex-row">
                        <button onClick={() => setShowSearch(true)}>
                            <Search className='mr-3 text-white h-6 w-10 ' />
                        </button>

                        <button
                            onClick={onLogin}
                            className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition cursor-pointer"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;