// pages/Home.jsx
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}


export default function Hero() {
  return (
    <section className="pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16">
        
        <div>
          <h1 className="text-5xl font-bold mb-6">
            Intelligent Job Matching
          </h1>
          <p className="text-gray-500 mb-6">
            AI-powered career platform for smarter job search.
          </p>

          <button className="bg-indigo-600 text-white px-6 py-3 rounded-full">
            Get Started
          </button>
        </div>

      </div>
    </section>
  );
}