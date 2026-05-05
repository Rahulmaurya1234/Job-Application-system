import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setForm({
        name: storedUser.name,
        email: storedUser.email,
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE PROFILE
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEdit(false);

      alert("Profile updated ✅");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.msg || "Update failed");
    }
  };

  // ✅ FILE SELECT (VALIDATION)
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    // 🔥 only pdf allow
    if (selected.type !== "application/pdf") {
      alert("Only PDF allowed ❌");
      return;
    }

    setFile(selected);
  };

  // ✅ UPLOAD RESUME
  const handleUpload = async () => {
    if (!file) return alert("Select PDF file");

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

      const updatedUser = { ...user, resume: res.data.resume };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Resume uploaded ✅");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Upload failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
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
            <p>{user?.name}</p>
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
            <p>{user?.email}</p>
          )}
        </div>

        {/* EDIT */}
        <div className="flex gap-3">
          {edit ? (
            <button
              onClick={handleUpdate}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Save
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

          {/* UPLOAD */}
          <div className="mt-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />

            <button
              onClick={handleUpload}
              className="bg-purple-600 px-4 py-2 rounded mt-2"
            >
              {user?.resume ? "Replace Resume" : "Upload Resume"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}