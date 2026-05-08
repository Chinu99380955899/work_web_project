import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Job, { IJob } from "../models/Job";

// Create job
export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      companyName,
      jobTitle,
      jobDescription,
      skills,
      location,
      minExp,
      maxExp,
      minSalary,
      maxSalary
    } = req.body;

    const job = new Job({
      companyName,
      jobTitle,
      jobDescription,
      skills: Array.isArray(skills)
        ? skills.map((s: string) => s.trim()).filter(Boolean)
        : typeof skills === "string"
        ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      location,
      minExp: minExp ? Number(minExp) : undefined,
      maxExp: maxExp ? Number(maxExp) : undefined,
      minSalary: minSalary ? Number(minSalary) : undefined,
      maxSalary: maxSalary ? Number(maxSalary) : undefined
    });

    const savedJob = await job.save();
    return res.status(201).json(savedJob);
  } catch (err) {
    next(err);
  }
};

// Get all jobs
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs: IJob[] = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// Update job
export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// Delete job
export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    next(err);
  }
};
