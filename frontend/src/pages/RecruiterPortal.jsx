import { useState, useEffect } from "react";
import axios from "axios";

export default function RecruiterPortal() {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
  });

  // 🔥 FETCH JOBS FROM BACKEND
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs");
      setJobs(res.data.jobs);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  // 🔥 POST JOB TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/jobs/create",
        job,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Job Posted Successfully 🚀");

      // reset form
      setJob({
        title: "",
        company: "",
        location: "",
        type: "",
        description: "",
      });

      setShowForm(false);

      // 🔥 reload jobs from DB
      fetchJobs();

    } catch (error) {
      console.log(error.response?.data);
      alert("Failed to post job ❌");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Recruiter</h1>
            <p className="text-slate-400">Manage your job postings</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            + Post Job
          </button>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl">
            <h3>Active Jobs</h3>
            <p className="text-3xl font-bold mt-2">{jobs.length}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl">
            <h3>Total Applicants</h3>
            <p className="text-3xl font-bold mt-2">1284</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl">
            <h3>New Candidates</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
        </div>

        {/* 🔥 JOB LIST */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Jobs</h2>

          {jobs.length === 0 ? (
            <p className="text-slate-400">No jobs added yet</p>
          ) : (
            jobs.map((j) => (
              <div
                key={j._id}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800"
              >
                <h3 className="text-xl font-semibold">{j.title}</h3>
                <p className="text-slate-400">
                  {j.company} • {j.location}
                </p>
                <p className="text-sm text-purple-400 mt-1">{j.type}</p>
                <p className="text-slate-300 mt-2">{j.description}</p>
              </div>
            ))
          )}
        </div>

      </main>

      {/* 🔥 MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

          <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Post New Job
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="Job Title"
                className="w-full p-3 rounded-lg bg-slate-800"
              />

              <input
                name="company"
                value={job.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full p-3 rounded-lg bg-slate-800"
              />

              <input
                name="location"
                value={job.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full p-3 rounded-lg bg-slate-800"
              />

              <select
                name="type"
                value={job.type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-800"
              >
                <option value="">Job Type</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Remote</option>
              </select>

              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                placeholder="Job Description"
                className="w-full p-3 rounded-lg bg-slate-800"
              />

              <div className="flex gap-4">

                <button
                  type="submit"
                  className="flex-1 bg-purple-600 py-3 rounded-lg"
                >
                  Add Job
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-slate-700 py-3 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}