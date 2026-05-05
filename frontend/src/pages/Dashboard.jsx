import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ENV (fallback safe)
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://job-application-system-a1x3.onrender.com";

  // 🔥 Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    setResume(storedUser.resume || null);
  }, [navigate]);

  // 🔥 Upload Resume
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF allowed ❌");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again ❌");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        `${API_URL}/api/user/upload-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = { ...user, resume: res.data.resume };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(updatedUser);
      setResume(res.data.resume);

      alert("Resume uploaded ✅");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900 px-6 py-6 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm text-emerald-300">CareerAI</p>

            <h1 className="mt-2 text-3xl text-white">
              Welcome back, {user?.name || "User"}
            </h1>

            <p className="text-slate-400 mt-2">
              Your AI assistant is ready 🚀
            </p>
          </div>

          <label className="cursor-pointer bg-purple-600 px-5 py-3 rounded text-white">
            {loading ? "Uploading..." : "Upload Resume"}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
        </header>

        {/* RESUME CARD */}
        <div className="bg-slate-900 p-6 rounded-xl mb-6">
          <h2 className="text-lg">Resume</h2>

          <p className="mt-2 text-white">
            {resume ? resume.split("/").pop() : "No Resume Uploaded"}
          </p>

          {resume && (
            <a
                href={resume}   // ✅ FIXED
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 underline mt-2 block"
            >
                View Resume
            </a>
            )}
        </div>

        {/* AI INSIGHTS (static for now) */}
        <div>
          <h2 className="text-2xl mb-4">AI Resume Insights</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-slate-900 p-5 rounded">
              <p className="text-slate-400">Skills</p>
              <p>React, Node, Python</p>
            </div>

            <div className="bg-slate-900 p-5 rounded">
              <p className="text-slate-400">Experience</p>
              <p>Mid-Level</p>
            </div>

            <div className="bg-slate-900 p-5 rounded">
              <p className="text-slate-400">Roles</p>
              <p>Frontend / Fullstack</p>
            </div>

            <div className="bg-slate-900 p-5 rounded">
              <p className="text-slate-400">Strength</p>
              <p className="text-emerald-400">82%</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}