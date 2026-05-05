import { useState } from "react";

export default function UserDashboard() {

  // 🔥 Available jobs (like job portal)
  const [jobs] = useState([
    {
      title: "Frontend Developer",
      company: "Google",
      location: "Remote",
      type: "Full-Time",
    },
    {
      title: "AI Engineer",
      company: "OpenAI",
      location: "San Francisco",
      type: "Full-Time",
    },
    {
      title: "Backend Developer",
      company: "Amazon",
      location: "Remote",
      type: "Part-Time",
    },
  ]);

  // 🔥 Applied jobs
  const [appliedJobs, setAppliedJobs] = useState([]);

  // 🔥 User profile
  const [user] = useState({
    name: "Alex Sharma",
    email: "alex@gmail.com",
    role: "Frontend Developer",
  });

  // 🔥 Apply function
  const handleApply = (job) => {
    setAppliedJobs([...appliedJobs, job]);
    alert("Applied Successfully 🚀");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* 🔹 HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user.name}
          </h1>
          <p className="text-slate-400">
            Track your jobs & profile
          </p>
        </div>

        {/* 🔹 PROFILE CARD */}
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>

        {/* 🔹 AVAILABLE JOBS */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Available Jobs
          </h2>

          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-slate-400">
                  {job.company} • {job.location}
                </p>
                <p className="text-purple-400 mt-1">{job.type}</p>

                <button
                  onClick={() => handleApply(job)}
                  className="mt-3 bg-purple-600 px-4 py-2 rounded-lg"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 🔹 APPLIED JOBS */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Applied Jobs
          </h2>

          {appliedJobs.length === 0 ? (
            <p className="text-slate-400">
              No jobs applied yet
            </p>
          ) : (
            appliedJobs.map((job, index) => (
              <div
                key={index}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-4"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-slate-400">
                  {job.company} • {job.location}
                </p>
                <p className="text-green-400 mt-1">
                  Applied ✅
                </p>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}