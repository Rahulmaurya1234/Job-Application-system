export default function Steps() {
  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      desc: "Share your resume in seconds and let our AI extract your skills.",
    },
    {
      number: "02",
      title: "AI Analysis",
      desc: "Our model analyzes your experience and identifies top-fit roles.",
    },
    {
      number: "03",
      title: "Get Matched",
      desc: "Receive personalized job matches from top companies.",
    },
    {
      number: "04",
      title: "Apply & Grow",
      desc: "Apply with confidence and move ahead in your career.",
    },
  ];

  return (
    <section id="workflow" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Process
          </p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            How CareerAI works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            A simple four-step workflow so you can move from resume to interview
            with fewer distractions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-xl font-semibold text-primary">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
