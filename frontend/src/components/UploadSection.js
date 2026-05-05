function UploadSection({ setFile, handleUpload, loading }) {
  return (
    <>
      <h1>🚀 AI Job Recommender</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Find Jobs
      </button>

      {loading && <p>Analyzing resume...</p>}

      <hr />
    </>
  );
}

export default UploadSection;