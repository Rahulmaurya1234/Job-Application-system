import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  // 🔥 load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔥 upload resume
  const handleUpload = async () => {
    if (!file) {
      alert("Select file first");
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

      alert("Resume uploaded ✅");

      // 🔥 update user locally
      const updatedUser = { ...user, resume: res.data.resume };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-xl mx-auto bg-slate-900 p-6 rounded-xl space-y-6">

        <h1 className="text-2xl font-bold">User Profile</h1>

        {/* 👤 Name */}
        <p><strong>Name:</strong> {user?.name}</p>

        {/* 📧 Email */}
        <p><strong>Email:</strong> {user?.email}</p>

        {/* 📄 Resume status */}
        <div>
          <p><strong>Resume:</strong></p>

          {user?.resume ? (
            <a
              href={`http://localhost:5000/${user.resume}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline"
            >
              View Resume
            </a>
          ) : (
            <p className="text-red-400">No resume uploaded ❌</p>
          )}
        </div>

        {/* ⬆️ Upload */}
        <div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
          />

          <button
            onClick={handleUpload}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            {user?.resume ? "Replace Resume" : "Upload Resume"}
          </button>
        </div>

      </div>
    </div>
  );
}