import { useState } from "react";
import axios from "axios";

const ATSChecker = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleUpload = async () => {
    if (!file) return alert("Upload resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      if (!API_URL) {
        alert("API URL not set ❌");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/ats/check`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error checking resume ❌");
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

      <div className="w-full max-w-3xl mx-auto">

        {!result && (
          <div className="flex justify-center">
            <div className="w-full max-w-lg bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">

              <h1 className="text-2xl font-bold">ATS Resume Checker</h1>

              <p className="text-slate-400 mt-2 mb-6 text-sm">
                Upload your resume and get insights
              </p>

              <label className="border border-dashed border-slate-600 rounded-xl p-6 cursor-pointer block">
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
                className="mt-6 w-full py-3 rounded-xl bg-emerald-500"
              >
                {loading ? "Analyzing..." : "Check ATS Score"}
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 mt-6">

            <div className="bg-slate-900 p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold">
                {result.atsScore}
              </div>
              <p className="text-sm text-slate-400">Score</p>

              <p className="mt-3 text-emerald-400">
                {result.message}
              </p>
            </div>

            {result.breakdown && (
              <div className="bg-slate-900 p-5 rounded-2xl space-y-3">
                <h2 className="text-lg font-semibold">Analysis</h2>

                {Object.entries(result.breakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key}</span>
                    <span className={getColor(value)}>{value}%</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className="w-full py-3 rounded-xl bg-emerald-500"
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