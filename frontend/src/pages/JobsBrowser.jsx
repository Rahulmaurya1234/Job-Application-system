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

  // 🔥 UNIFIED FILTER (AI + LOCAL)
  const finalJobs = useMemo(() => {
    const data = aiJobs.length > 0 ? aiJobs : jobs;

    return data.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const company = job.company?.toLowerCase() || "";
      const loc = (job.location || "remote").toLowerCase();
      const type = job.type || "Remote";

      const matchesQuery =
        query === "" ||
        title.includes(query.toLowerCase()) ||
        company.includes(query.toLowerCase());

      const matchesLocation =
        location === "" ||
        loc.includes(location.toLowerCase());

      const matchesType =
        activeTypes.length === 0 ||
        activeTypes.includes(type);

      const matchesLocationFilter =
        locationFilter === "All" ||
        (locationFilter === "Remote" && loc.includes("remote")) ||
        (locationFilter === "Onsite" && !loc.includes("remote"));

      const matchesRole =
        roleFilter === "All" ||
        title.includes(roleFilter.toLowerCase());

      return (
        matchesQuery &&
        matchesLocation &&
        matchesType &&
        matchesLocationFilter &&
        matchesRole
      );
    });
  }, [aiJobs, query, location, activeTypes, locationFilter, roleFilter]);

  // 🔥 AI CALL
  const fetchAIJobs = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.resume) {
        alert("No resume uploaded ❌");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://127.0.0.1:5001/analyze",
        {
          resumeUrl: `http://localhost:5000/${user.resume}`,
        }
      );

      setAiJobs(res.data);
      setLoading(false);

    } catch (err) {
      console.error(err);
      alert("Error fetching jobs");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.25fr]">

          {/* SIDEBAR */}
          <aside className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">

            {/* 🔥 TITLE */}
            <h2 className="text-xl font-semibold text-white">Filters</h2>
            <p className="text-sm text-slate-400 mt-1">
                Narrow down jobs based on your preferences
            </p>

            <div className="mt-6 space-y-4">

                {/* LOCATION FILTER */}
                <div>
                <label className="text-sm text-slate-400">Work Type</label>
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 text-white mt-1"
                >
                    <option>All</option>
                    <option>Remote</option>
                    <option>Onsite</option>
                </select>
                </div>

                {/* ROLE FILTER */}
                <div>
                <label className="text-sm text-slate-400">Role</label>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 text-white mt-1"
                >
                    <option>All</option>
                    <option>Engineer</option>
                    <option>Researcher</option>
                    <option>Designer</option>
                </select>
                </div>

            </div>

  {/* 🔥 EXTRA INFO */}
  <div className="mt-6 p-4 rounded-xl bg-slate-800/60 text-sm text-slate-300">
    💡 Tip: Use filters to find jobs that match your skills faster.
  </div>

</aside>

          {/* MAIN */}
          <main className="space-y-6">

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6">
              <div className="flex justify-between">

                <h2 className="text-3xl text-white">Browse JOB </h2>

                <button
                  onClick={fetchAIJobs}
                  className="px-5 py-3 bg-slate-800 rounded-xl"
                >
                  Most Recent
                </button>

              </div>
            </div>

            {loading && <p>Loading...</p>}

            <div className="space-y-5">
              {finalJobs.map((job, index) => (
                <div key={index} className="bg-slate-900 p-6 rounded-xl">

                  <h3 className="text-xl">{job.title}</h3>
                  <p className="text-slate-400">
                    {job.company} • {job.location || "Remote"}
                  </p>

                  {job.similarity && (
                    <p className="text-emerald-300">
                      {(job.similarity * 100).toFixed(1)}% Match
                    </p>
                  )}

                  {job.url && (
                    <a href={job.url} target="_blank" rel="noreferrer">
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