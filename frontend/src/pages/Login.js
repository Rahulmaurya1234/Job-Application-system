import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://job-application-system-a1x3.onrender.com";

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log("Login button clicked"); // 🔥 DEBUG

    if (!email || !password) {
      alert("Enter email & password ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Response:", res.data); // 🔥 DEBUG

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login Success 🚀");
        navigate("/dashboard");
      } else {
        alert(res.data.msg || "Login failed ❌");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.msg || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl">

          <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-4">

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 p-3 rounded"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-emerald-300">
              Sign up
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}