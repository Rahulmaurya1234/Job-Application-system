import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // ✅ LOGIN CONNECTED
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                alert("Login Success 🚀");
                navigate("/dashboard");
            } else {
                alert(res.data.msg || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || "Login failed");
        }
    };

    // ✅ FORGOT PASSWORD CONNECTED
    const handleForgotPassword = async () => {
        if (!email) {
            alert("Enter your email first");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/forgot-password",
                { email }
            );

            alert(res.data.msg || "Reset link sent 🚀");

            if (res.data.token) {
                console.log("Reset Token:", res.data.token);
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || "Error sending reset link");
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
                        <Link className="text-slate-400 transition hover:text-emerald-300" to="/signup">
                            Sign Up
                        </Link>
                        <Link className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primaryDark" to="/signup">
                            Create Account
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
                <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-soft">
                    <div className="grid gap-0 md:grid-cols-2">

                        <div className="relative hidden bg-slate-900 text-white md:flex flex-col justify-between p-12">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined mb-6 text-4xl text-purple-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    Career AI
                                </span>

                                <h1 className="mb-4 text-4xl font-bold leading-tight bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                                    Unlock Your Career with AI 🚀
                                </h1>

                                <p className="max-w-sm text-base leading-relaxed text-slate-400">
                                    Discover smarter job opportunities, get personalized matches, and grow your career faster with AI-powered insights.
                                </p>

                                {/* small highlight */}
                                <div className="mt-6 text-sm text-emerald-400">
                                    ✔ 50K+ users • ✔ Smart Matching • ✔ Faster Hiring
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="bg-slate-900 p-8 md:p-16">
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="mb-2 text-3xl font-bold text-white">Welcome Back</h2>
                                <p className="text-sm text-slate-400">
                                Sign in to access your personalized dashboard and job recommendations.
                            </p>
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    type="email"
                                    className="w-full p-3 bg-slate-800 rounded"
                                />

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span>Password</span>
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-emerald-300"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        className="w-full p-3 bg-slate-800 rounded"
                                    />
                                </div>

                                <button className="w-full bg-purple-600 p-3 rounded">
                                    Sign In to Dashboard
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-500">
                                Don't have an account?{" "}
                                <Link className="text-emerald-300" to="/signup">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}