import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("jobseeker");

    // ✅ SIGNUP CONNECTED
    const handleSignup = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    name,
                    email,
                    password,
                    role,
                }
            );

            if (res.data.success) {
                // auto login after signup
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                alert("Signup Success 🎉");

                // redirect
                navigate("/dashboard");
            } else {
                alert(res.data.msg || "Signup failed");
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || "Signup failed");
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-soft">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
                            CareerAI
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link className="text-slate-400 hover:text-emerald-300" to="/login">
                            Login
                        </Link>
                        <Link className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primaryDark" to="/login">
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">

                <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 
                bg-slate-900/80 backdrop-blur-xl 
                shadow-[0_25px_80px_rgba(0,0,0,0.7)] 
                transition-all duration-500">

                    <div className="grid md:grid-cols-2">

                        {/* LEFT SAME */}
                        <div className="hidden md:flex flex-col justify-between p-12">
                            <div>
                                <h1 className="text-4xl font-bold leading-tight">
                                    Your Future Job, Powered by AI
                                </h1>

                                <p className="text-slate-400 mt-4 text-lg leading-relaxed">
                                    Build your profile, get personalized job matches, and stand out to recruiters — all in one place.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="p-8 md:p-16">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold">Create Account</h2>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-6">

                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 
                                    focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 
                                    outline-none transition text-sm"
                                />

                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    type="email"
                                    className="w-full p-3 bg-slate-800 rounded"
                                />

                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-3 bg-slate-800 rounded"
                                />


                                <button className="w-full bg-purple-600 p-3 rounded">
                                    Create Account
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-400">
                                Already have an account?{" "}
                                <Link to="/login" className="text-emerald-300">
                                    Login
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}