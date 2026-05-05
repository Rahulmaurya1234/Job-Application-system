import Job from "../models/Job.js";

// 🔥 Create Job (Recruiter only)
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      createdBy: req.user._id,
    });

    res.json({
      success: true,
      job,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 🔥 Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};