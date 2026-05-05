export default function CTA() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-r from-primary to-primaryDark text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
          Ready for your next role?
        </p>
        <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
          Ready to evolve your career?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-100">
          Join thousands of professionals who found their next role faster with
          CareerAI.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow-soft transition hover:bg-slate-100">
            Sign Up Now
          </button>
          <button className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}
