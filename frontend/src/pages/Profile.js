import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://job-application-system-a1x3.onrender.com";

  // 🔥 LOAD USER
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Please login again ❌");
      return;
    }

    setUser(storedUser);
    setForm({
      name: storedUser.name || "",
      email: storedUser.email || "",
    });
  }, []);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return alert("User not logged in ❌");

      const res = await axios.put(`${API_URL}/api/auth/update`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = { ...user, ...res.data.user };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEdit(false);

      alert("Profile updated ✅");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILE SELECT
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // ✅ Better validation
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF allowed ❌");
      return;
    }

    setFile(selected);
  };

  // 🔥 UPLOAD RESUME
  const handleUpload = async () => {
    if (!file) return alert("Select PDF file ❌");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return alert("Please login again ❌");

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

      setFile(null); // ✅ reset file

      alert("Resume uploaded ✅");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIX URL (safety for old data)
  const getResumeUrl = () => {
    if (!user?.resume) return null;

    return user.resume.includes("/upload/") &&
      !user.resume.includes("/raw/upload/")
      ? user.resume.replace("/upload/", "/raw/upload/")
      : user.resume;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 pt-24">
      <div className="max-w-2xl mx-auto bg-slate-900 p-6 rounded-xl space-y-6">

        <h1 className="text-2xl font-bold">👤 Profile</h1>

        {/* NAME */}
        <div>
          <label className="text-slate-400">Name</label>
          {edit ? (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 rounded mt-1"
            />
          ) : (
            <p>{user?.name || "N/A"}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-slate-400">Email</label>
          {edit ? (
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 rounded mt-1"
            />
          ) : (
            <p>{user?.email || "N/A"}</p>
          )}
        </div>

        {/* EDIT BUTTON */}
        <div className="flex gap-3">
          {edit ? (
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-green-600 px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* RESUME */}
        <div className="border-t border-slate-700 pt-4">
          <h2 className="text-lg font-semibold">Resume</h2>

          {getResumeUrl() ? (
            <a
              href={getResumeUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline"
            >
              View Resume
            </a>
          ) : (
            <p className="text-red-400">No resume uploaded ❌</p>
          )}

          <div className="mt-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={loading}
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-purple-600 px-4 py-2 rounded mt-2"
            >
              {loading
                ? "Uploading..."
                : user?.resume
                ? "Replace Resume"
                : "Upload Resume"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}