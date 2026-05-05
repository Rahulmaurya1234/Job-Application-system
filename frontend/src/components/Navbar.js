import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {

    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-6 py-4 gap-4">
                
                <div className="flex items-center gap-6">
                    
                    <Link
                                to="/"
                                className="rounded-2xl bg-gradient-to-r from-emerald-500/20 to-purple-500/20 px-5 py-2 text-sm font-semibold text-emerald-200 shadow-md shadow-emerald-900/30 hover:shadow-emerald-500/30 hover:scale-105 transition"
                            >
                                CareerAI
                            </Link>

                    <nav className="hidden items-center gap-4 text-sm text-slate-400 md:flex">
                        <Link to="/" className="transition hover:text-white">Home</Link>
                        <Link to="/dashboard" className="transition hover:text-white">Dashboard</Link>
                        <Link to="/jobs" className="transition hover:text-white">Jobs</Link>
                        {/* <Link to="/recruiter" className="transition hover:text-white">Recruiter</Link>
                        <Link to="/user" className="transition hover:text-white">User</Link> */}
                        <Link to="/ats" className="transition hover:text-white">ATS Resume Cheker </Link>
                        <Link to="/About" className="transition hover:text-white">About us</Link> 
                    </nav>
                </div>

                <div className="flex flex-wrap items-center gap-3 relative" ref={dropdownRef}>
                    
                    {user ? (
                        <>
                            {/* 👤 Name + Icon */}
                            <div
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>

                                <span className="text-emerald-300 text-sm font-semibold">
                                    {user.name}
                                </span>
                            </div>

                            {/* 🔽 dropdown */}
                            {open && (
                                <div className="absolute right-0 top-12 w-40 bg-slate-900 border border-white/10 rounded-xl shadow-lg p-2">
                                    
                                    <Link
                                        to="/profile"
                                        onClick={() => setOpen(false)} 
                                        className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded"
                                    >
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryDark"
                            >
                                Signup
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </header>
    );
}