import { useState } from "react";
import axios from "axios";

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Upload resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/ats/check",
        formData
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error checking resume");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (score) => {
    if (score > 75) return "text-emerald-400";
    if (score > 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">

      {/* CENTER CONTAINER */}
      <div className="w-full max-w-3xl mx-auto">

        {/* Upload Card */}
        {!result && (
          <div className="flex justify-center">
            <div className="w-full max-w-lg bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">

              <h1 className="text-2xl font-bold text-white">
                ATS Resume Checker
              </h1>

              <p className="text-slate-400 mt-2 mb-6 text-sm">
                Upload your resume and get insights
              </p>

              <label className="border border-dashed border-slate-600 rounded-xl p-6 cursor-pointer block hover:border-emerald-500 transition">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <p className="text-slate-400 text-sm">
                  {file ? file.name : "Click to upload resume"}
                </p>
              </label>

              <button
                onClick={handleUpload}
                className="mt-6 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
              >
                {loading ? "Analyzing..." : "Check ATS Score"}
              </button>
            </div>
          </div>
        )}

        {/* RESULT UI */}
        {result && (
          <div className="space-y-6 mt-6">

            {/* Score */}
            <div className="bg-slate-900 p-6 rounded-2xl text-center border border-slate-800">
              <div className="text-4xl font-bold text-white">
                {result.atsScore}
              </div>
              <p className="text-sm text-slate-400">Score</p>

              <p className="mt-3 text-emerald-400 font-medium">
                {result.message}
              </p>
            </div>

            {/* Breakdown */}
            {result.breakdown && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  Analysis Breakdown
                </h2>

                {Object.entries(result.breakdown).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between bg-slate-950 p-3 rounded-lg"
                  >
                    <span className="capitalize text-slate-400">{key}</span>
                    <span className={getColor(value)}>{value}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Missing Keywords */}
            {result.missingKeywords && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <h2 className="text-lg font-semibold mb-3 text-white">
                  Missing Keywords
                </h2>

                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-950 rounded-full text-sm text-emerald-400"
                    >
                      + {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions && (
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h2 className="text-lg font-semibold text-white">
                  Suggestions
                </h2>

                {result.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 p-3 rounded-lg text-slate-300"
                  >
                    💡 {s}
                  </div>
                ))}
              </div>
            )}

            {/* Reset */}
            <button
              onClick={() => setResult(null)}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
            >
              Upload New Resume
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default ATSChecker;