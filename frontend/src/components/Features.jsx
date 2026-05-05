export default function Features() {
  const features = [
    {
      title: "AI-Driven Deep Matching",
      description:
        "Our proprietary algorithm analyzes your skills, experience, and fit to surface the best roles.",
      badge: "Match",
    },
    {
      title: "Recruiter Workspace",
      description:
        "Manage candidates, organize interviews, and connect with the best talent faster.",
      badge: "Workspace",
    },
    {
      title: "Enterprise API",
      description:
        "Integrate CareerAI into your team’s workflow with powerful developer tools.",
      badge: "API",
    },
    {
      title: "Salary Benchmarking",
      description:
        "Compare salaries with market demand to negotiate confidently and grow your career.",
      badge: "Insights",
    },
  ];

  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Precision tools
          </p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Precision tools for modern hiring
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Built to help candidates and recruiters move faster, smarter, and
            with more confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="mb-5 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                {feature.badge}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
