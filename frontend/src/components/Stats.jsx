export default function Stats() {
  const stats = [
    { value: "45k+", label: "Active jobs" },
    { value: "1.2M", label: "Users" },
    { value: "8.5k", label: "Companies" },
    { value: "99%", label: "Match rate" },
  ];

  return (
    <section className="bg-slate-50" aria-labelledby="stats-heading">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-4 rounded-3xl bg-white px-6 py-8 shadow-soft sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-semibold text-primary">{s.value}</p>
              <p className="mt-2 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
