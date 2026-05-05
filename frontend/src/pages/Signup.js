import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("jobseeker");

    // ✅ ENV
    const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://job-application-system-a1x3.onrender.com";

    const AI_URL =
  process.env.REACT_APP_AI_URL ||
  "https://job-application-system-1.onrender.com";

    console.log("API_URL:", API_URL);
    console.log("AI_URL:", AI_URL);
    const handleSignup = async (event) => {
        event.preventDefault();

        // 🔥 SAFETY CHECK (IMPORTANT)
        if (!API_URL) {
            alert("API URL not set ❌");
            console.log("ENV:", process.env);
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/api/auth/signup`,
                {
                    name,
                    email,
                    password,
                    role,
                }
            );

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                alert("Signup Success 🎉");
                navigate("/dashboard");
            } else {
                alert(res.data.msg || "Signup failed");
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || "Signup failed ❌");
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-xl font-bold text-white">
                        CareerAI
                    </Link>

                    <div className="flex gap-4">
                        <Link to="/login" className="text-slate-400">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
                <div className="w-full max-w-lg bg-slate-900 p-8 rounded-xl">

                    <h2 className="text-2xl font-bold mb-6">Create Account</h2>

                    <form onSubmit={handleSignup} className="space-y-4">

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full p-3 bg-slate-800 rounded"
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

                    <p className="mt-4 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-300">
                            Login
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}