import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlignLeft, Clock, KeyRound, Braces, Copy, Minimize2 } from "lucide-react";
import Navbar from "./Navbar.jsx";

const LIVE = [
    { icon: AlignLeft, title: "Format & validate", text: "Paste JSON, see errors instantly, then prettify or minify it in one click." },
    { icon: Clock, title: "Expiring share links", text: "Generate a link that disappears after 10 minutes, a day, a week, or whenever you choose." },
    { icon: KeyRound, title: "History, no login", text: "Your links are saved to an anonymous session code. No account, no email, no password." },
];

const SOON = [
    { icon: Braces, title: "JSON → XML", text: "Convert JSON to clean, well-formed XML." },
    { icon: Copy, title: "XML → JSON", text: "Turn XML payloads into readable JSON." },
    { icon: Minimize2, title: "JSON Compare", text: "Diff two JSON documents and see exactly what changed." },
];

function Landing() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black text-white">
            <Navbar />
            <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

            <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
                {/* Hero */}
                <section className="mx-auto max-w-3xl text-center">
                    <span className="inline-block rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs text-purple-300">
                        Free · No login · Built for developers
                    </span>
                    <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
                        Small tools for the <span className="text-purple-300">JSON</span> you deal with every day
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-gray-400">
                        Dev Toolbox is a growing set of quick, no-fuss developer utilities. Right now you can format and validate
                        JSON and share it through a link that expires on your schedule.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to="/editor" className="flex items-center gap-2 rounded-xl bg-purple-300 px-6 py-3 font-medium text-black transition hover:bg-purple-200">
                            Open JSON tool <ArrowRight size={18} />
                        </Link>
                        <a href="#coming-soon" className="rounded-xl border border-gray-800 px-6 py-3 text-gray-300 transition hover:border-gray-600 hover:text-white">
                            See what's coming
                        </a>
                    </div>
                </section>

                {/* Live now */}
                <section className="mt-24">
                    <h2 className="text-2xl font-semibold">Available now</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {LIVE.map(({ icon: Icon, title, text }) => (
                            <div key={title} className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                                <span className="grid h-10 w-10 place-items-center rounded-lg bg-purple-300/10 text-purple-300"><Icon size={20} /></span>
                                <h3 className="mt-4 font-medium">{title}</h3>
                                <p className="mt-1.5 text-sm text-gray-400">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section className="mt-24">
                    <h2 className="text-2xl font-semibold">How sharing works</h2>
                    <ol className="mt-6 grid gap-4 md:grid-cols-3">
                        {["Paste or write your JSON in the editor.", "Pick a name and an expiry time, then generate a link.", "Share it. The link stops working when time is up."].map((t, i) => (
                            <li key={t} className="flex gap-4 rounded-2xl border border-gray-800 bg-gray-950 p-5">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-purple-300 text-sm font-bold text-black">{i + 1}</span>
                                <p className="text-sm text-gray-300">{t}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Coming soon */}
                <section id="coming-soon" className="mt-24 scroll-mt-24">
                    <h2 className="text-2xl font-semibold">Coming soon</h2>
                    <p className="mt-1 text-sm text-gray-400">What's being built next.</p>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {SOON.map(({ icon: Icon, title, text }) => (
                            <div key={title} className="rounded-2xl border border-dashed border-gray-800 bg-gray-950/50 p-5">
                                <div className="flex items-center justify-between">
                                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-gray-900 text-gray-400"><Icon size={20} /></span>
                                    <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-[10px] font-semibold text-gray-400">SOON</span>
                                </div>
                                <h3 className="mt-4 font-medium">{title}</h3>
                                <p className="mt-1.5 text-sm text-gray-400">{text}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-center text-sm text-gray-500">…and more converters and utilities down the line.</p>
                </section>

                <footer className="mt-24 border-t border-gray-900 pt-6 text-center text-xs text-gray-600">
                    Dev Toolbox · Your history is tied to an anonymous session in your browser.
                </footer>
            </main>
        </div>
    );
}

export default Landing;
