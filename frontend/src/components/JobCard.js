function JobCard({ job }) {
  return (
    <div style={{
      background: "#1e1e1e",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "15px"
    }}>
      <h3>{job.title} at {job.company}</h3>

      <p>
        <strong>Match:</strong>
        {(job.similarity * 100).toFixed(0)}%
      </p>

      <p>
        <strong>Tech:</strong> {job.tech_stack}
      </p>

      <a href={job.url} target="_blank" rel="noreferrer">
        View Job
      </a>
    </div>
  );
}

export default JobCard;