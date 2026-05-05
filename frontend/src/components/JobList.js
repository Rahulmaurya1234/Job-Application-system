import JobCard from "./JobCard";

function JobList({ jobs, loading }) {
  if (!loading && jobs.length === 0) {
    return <p>No jobs found yet.</p>;
  }

  return (
    <>
      {jobs.map((job, i) => (
        <JobCard key={i} job={job} />
      ))}
    </>
  );
}

export default JobList;