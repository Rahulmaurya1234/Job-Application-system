import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {

    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false); // ✅ NEW
    const dropdownRef = useRef();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950">
            
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    {/* 🍔 Hamburger (mobile only) */}
                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>

                    {/* Logo */}
                    <Link
                        to="/"
                        className="rounded-2xl bg-gradient-to-r from-emerald-500/20 to-purple-500/20 px-5 py-2 text-sm font-semibold text-emerald-200"
                    >
                        CareerAI
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-4 text-sm text-slate-400">
                        <Link to="/" className="hover:text-white">Home</Link>
                        <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
                        <Link to="/jobs" className="hover:text-white">Jobs</Link>
                        <Link to="/ats" className="hover:text-white">ATS Resume Checker</Link>
                        <Link to="/About" className="hover:text-white">About us</Link>
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                    
                    {user ? (
                        <>
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

                            {open && (
                                <div className="absolute right-0 top-12 w-40 bg-slate-900 border rounded-xl p-2">
                                    <Link to="/profile" className="text-white px-3 py-2 text-sm hover:bg-slate-800 rounded">
                                        Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-4 py-2 text-sm text-slate-200">Login</Link>
                            <Link to="/signup" className="px-4 py-2 text-sm text-white bg-blue-600 rounded">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* 📱 MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-slate-300">
                    <Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
                    <Link to="/dashboard" onClick={()=>setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/jobs" onClick={()=>setMenuOpen(false)}>Jobs</Link>
                    <Link to="/ats" onClick={()=>setMenuOpen(false)}>ATS Resume Checker</Link>
                    <Link to="/About" onClick={()=>setMenuOpen(false)}>About us</Link>
                </div>
            )}

        </header>
    );
}