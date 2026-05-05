import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [user, setUser] = useState(null);

  // 🔥 load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setResume(storedUser.resume || null);
    }
  }, []);

  // 🔥 upload resume (with login check)
  const handleResumeUpload = async (e) => {
    if (!user) {
      alert("Please login or signup first ");
      navigate("/login");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // only pdf
    if (file.type !== "application/pdf") {
      alert("Only PDF allowed ❌");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        "http://localhost:5000/api/user/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // update user + resume
      const updatedUser = { ...user, resume: res.data.resume };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(updatedUser);
      setResume(res.data.resume);

      alert("Resume updated ✅");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.msg || "Upload failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* 🔹 HEADER */}
        <header className="mb-8 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-900/70 px-6 py-6 shadow-soft backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
              CareerAI
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Welcome back, {user?.name || "User"}
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Your AI career assistant has found new matches.
            </p>
          </div>

          <div className="flex gap-3">
            <label className="cursor-pointer rounded-2xl bg-gradient-to-r from-primary to-primaryDark px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-primaryDark">
              Update Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>
          </div>
        </header>

        {/* 🔹 RESUME CARD */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Resume
          </p>

          <p className="mt-2 text-lg font-semibold text-white">
            {resume ? resume.split("/").pop() : "No Resume Uploaded"}
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-3xl bg-slate-950/80 px-4 py-3">
            <span className="text-sm text-slate-300">
              {resume ? "Upload Resume Successfuly" : "No file uploaded"}
            </span>

            <span className="text-sm font-semibold text-white">
              {resume ? "Ready" : "--"}
            </span>
          </div>
        </div>

        {/* 🔹 AI RESUME INSIGHTS */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            AI Resume Insights
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-slate-950 p-5 rounded-xl border border-white/10">
              <h3 className="text-sm text-slate-400">Detected Skills</h3>
              <p className="mt-2 text-white font-semibold">
                React, Node.js, MongoDB, Python
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-white/10">
              <h3 className="text-sm text-slate-400">Experience Level</h3>
              <p className="mt-2 text-white font-semibold">
                Mid-Level Developer
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-white/10">
              <h3 className="text-sm text-slate-400">Suggested Roles</h3>
              <p className="mt-2 text-white font-semibold">
                Frontend Developer, Full Stack Developer
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-white/10">
              <h3 className="text-sm text-slate-400">Resume Strength</h3>
              <p className="mt-2 text-emerald-400 font-bold">
                82% Strong
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}