export default function About() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">

      {/* HEADER */}
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          About CareerAI
        </h1>

        <p className="mt-6 text-slate-400 max-w-2xl mx-auto leading-7">
          CareerAI is an AI-powered platform designed to simplify your job search. 
          It helps users analyze resumes, find relevant job opportunities, and improve their career journey using smart technology.
        </p>
      </section>

      {/* PROJECT INFO */}
      <section className="max-w-6xl mx-auto mt-16 grid gap-6 md:grid-cols-3">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-white">AI Resume Analysis</h2>
          <p className="mt-3 text-sm text-slate-400">
            Get insights and improve your resume using AI-based evaluation.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-white">Job Matching</h2>
          <p className="mt-3 text-sm text-slate-400">
            Discover relevant job opportunities based on your skills and profile.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-white">Career Growth</h2>
          <p className="mt-3 text-sm text-slate-400">
            Improve your skills and get better opportunities with smart suggestions.
          </p>
        </div>

      </section>

      {/* TEAM SECTION */}
      <section className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-white text-center">
          Meet the Team
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">

          {/* Rahul */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Rahul Maurya
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Full Stack Developer
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Focused on building scalable web applications and AI-based solutions.
            </p>
          </div>

          {/* Divyanshu */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Divyanshu Kumar Singh
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Developer
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Contributed to backend logic and Ai system functionality.
              
            </p>
          </div>

          {/* Anshu */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white">
              Anshu Rajput
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Developer
            </p>
            <p className="mt-3 text-sm text-slate-500">
              Worked on frontend design and user experience improvements.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}