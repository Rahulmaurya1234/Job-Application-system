import { useMemo, useState } from "react";
import axios from "axios";

const jobs = [
  {
    title: "Senior LLM Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    title: "Machine Learning Researcher",
    company: "Anthropic",
    location: "Remote",
    type: "Remote",
  },
  {
    title: "GPU Optimization Engineer",
    company: "NVIDIA",
    location: "Santa Clara, CA",
    type: "Full-time",
  },
];

export default function JobsBrowser() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activeTypes, setActiveTypes] = useState([]);

  const [locationFilter, setLocationFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const [aiJobs, setAiJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ ENV
  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://job-application-system-a1x3.onrender.com";

  const AI_URL =
    process.env.REACT_APP_AI_URL ||
    "https://job-application-system-1.onrender.com";

  // 🔥 FILTER LOGIC
  const finalJobs = useMemo(() => {
    const data = aiJobs.length > 0 ? aiJobs : jobs;

    return data.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const loc = (job.location || "remote").toLowerCase();
      const type = job.type || "Remote";

      return (
        (query === "" ||
          title.includes(query.toLowerCase()) ||
          company.includes(query.toLowerCase())) &&
        (location === "" || loc.includes(location.toLowerCase())) &&
        (activeTypes.length === 0 || activeTypes.includes(type)) &&
        (locationFilter === "All" ||
          (locationFilter === "Remote" && loc.includes("remote")) ||
          (locationFilter === "Onsite" && !loc.includes("remote"))) &&
        (roleFilter === "All" ||
          title.includes(roleFilter.toLowerCase()))
      );
    });
  }, [aiJobs, query, location, activeTypes, locationFilter, roleFilter]);

  // 🔥 AI JOB FETCH (FINAL FIXED)
  const fetchAIJobs = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.resume) {
        alert("No resume uploaded ❌");
        return;
      }

      // ✅ CLOUDINARY FIX (MOST IMPORTANT)
      const resumeUrl = user.resume.includes("/raw/upload")
        ? user.resume.replace("/raw/upload", "/upload")
        : user.resume;

      console.log("Fixed Resume URL:", resumeUrl);

      const res = await axios.post(
        `${AI_URL}/analyze`,
        {
          resumeUrl: resumeUrl,
        },
        {
          timeout: 15000,
        }
      );

      console.log("AI response:", res.data);

      // ✅ ERROR HANDLE
      if (!res.data || res.data.error) {
        alert(res.data?.error || "No jobs returned ❌");
        return;
      }

      setAiJobs(res.data);

    } catch (err) {
      console.error("AI ERROR:", err);

      if (err.code === "ECONNABORTED") {
        alert("AI server timeout ❌");
      } else {
        alert(err.response?.data?.msg || "AI server error ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">

          {/* SIDEBAR */}
          <aside className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Filters</h2>

            <div className="mt-6 space-y-4">

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-3 bg-slate-800 rounded"
              >
                <option>All</option>
                <option>Remote</option>
                <option>Onsite</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-3 bg-slate-800 rounded"
              >
                <option>All</option>
                <option>Engineer</option>
                <option>Researcher</option>
                <option>Designer</option>
              </select>

            </div>
          </aside>

          {/* MAIN */}
          <main className="space-y-6">

            <div className="flex justify-between bg-slate-900 p-6 rounded-2xl">
              <h2 className="text-2xl">Browse Jobs</h2>

              <button
                onClick={fetchAIJobs}
                disabled={loading}
                className="bg-emerald-500 px-5 py-2 rounded"
              >
                {loading ? "Analyzing..." : "AI Jobs"}
              </button>
            </div>

            {loading && (
              <p className="text-yellow-400">Fetching AI jobs...</p>
            )}

            <div className="space-y-4">
              {finalJobs.map((job, index) => (
                <div key={index} className="bg-slate-900 p-5 rounded-xl">

                  <h3 className="text-lg">{job.title}</h3>
                  <p className="text-slate-400">
                    {job.company} • {job.location || "Remote"}
                  </p>

                  {job.similarity && (
                    <p className="text-emerald-400">
                      {(job.similarity * 100).toFixed(1)}% Match
                    </p>
                  )}

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 underline"
                    >
                      Apply Now
                    </a>
                  )}

                </div>
              ))}
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}