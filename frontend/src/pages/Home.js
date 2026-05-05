import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      {/* HERO SECTION */}
      <section className="bg-slate-950 px-6 py-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="inline-flex rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300 border border-slate-700">
              AI Job Platform
            </div>

            <h1 className="mt-8 text-5xl font-bold text-white sm:text-6xl leading-tight">
              Discover jobs from{" "}
              <span className="text-emerald-400">
                multiple platforms
              </span>{" "}
              in one place
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              CareerAI brings together job listings from top platforms and matches them with your skills using AI. 
              Find the right opportunities faster and smarter in one place.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() => navigate("/jobs")}
                className="rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition"
              >
                Explore Jobs →
              </button>

              <button
                onClick={() => navigate("/ats")}
                className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Check Resume Score
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                View Dashboard
              </button>

            </div>

            <p className="mt-6 text-sm text-slate-500">
              Trusted by 50,000+ professionals
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="lg:w-[520px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-950 p-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    AI CAREER INSIGHTS
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Analyze Your Resume
                  </p>
                </div>

                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  🔥
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <p className="text-xs text-slate-500">Strength</p>
                  <p className="mt-2 text-sm text-white font-medium">
                    Top Performance
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                  <p className="text-xs text-slate-500">ATS Score</p>
                  <p className="mt-2 text-sm text-white font-medium">
                    82%
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-950 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {[
              { value: "45k+", label: "Active jobs" },
              { value: "1.2M", label: "Users" },
              { value: "8.5k", label: "Companies" },
              { value: "99%", label: "Match rate" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
                <p className="text-3xl font-semibold text-emerald-400">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Smart AI System
            </p>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              AI That Helps You Get Hired Faster
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Analyze your resume, match it with real job listings across platforms, and get smart suggestions to improve your chances instantly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                title: "AI Resume Analysis",
                description: "Automatically extracts skills and insights from your resume."
              },
              {
                title: "ATS Score Checker",
                description: "Get your resume score and improve it."
              },
              {
                title: "AI Job Matching",
                description: "Find relevant jobs based on your skills."
              },
              {
                title: "Skill Gap Insights",
                description: "Discover missing skills and improve."
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 text-center">

          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to <span className="text-emerald-400">accelerate your career</span>?
          </h2>

          <p className="mt-4 text-slate-400">
            Discover smarter opportunities and land your dream job faster.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="mt-8 rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition"
          >
            Get Started
          </button>

        </div>
      </section>

    </main>
  );
}