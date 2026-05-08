import express, { Response, NextFunction } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/auth";
import JobApplication from "../models/JobApplication";
import Job from "../models/Job";
import { ApiError } from "../middleware/errorHandler";
import mongoose from "mongoose";
const router = express.Router();

/**
 * 📌 Candidate Apply for Job API
 * POST /api/job-applications/job/apply
 */
router.post(
  "/job/apply",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.body;

      const candidateId =
        (req.user && (req.user as any).userId) || req.user?._id || req.user?.id;

      if (!jobId) throw new ApiError(400, "Job ID is required");
      if (!candidateId) throw new ApiError(401, "Unauthorized user");

      const job = await Job.findById(jobId);
      if (!job) throw new ApiError(404, "Job not found");

      // ✅ Prevent duplicate applications
      const existingApplication = await JobApplication.findOne({
        jobId,
        candidateId,
      });
      if (existingApplication)
        throw new ApiError(400, "Already applied for this job");

      // ✅ Create new application
      const newApplication = await JobApplication.create({
        jobId,
        candidateId,
        appliedAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: "Job application submitted successfully",
        data: newApplication,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 📌 Get all jobs applied by the logged-in candidate
 * GET /api/job-applications/my-applications
 */
router.get(
  "/my-applications",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const candidateId =
        (req.user && (req.user as any).userId) || req.user?._id || req.user?.id;

      if (!candidateId) throw new ApiError(401, "Unauthorized user");

      // ✅ Get all job applications with populated job details
      const applications = await JobApplication.find({ candidateId }).populate("jobId");

      // ✅ Safely type-cast the populated job
      const appliedJobs = applications.map((app) => {
        const job = app.jobId as any; // 👈 explicitly tell TS this is a Job document
        return {
          _id: job?._id,
          jobTitle: job?.jobTitle,
          companyName: job?.companyName,
          location: job?.location,
          salaryRange: job?.salaryRange,
          jobType: job?.jobType,
          appliedAt: app.appliedAt,
        };
      });

      res.status(200).json({
        success: true,
        data: appliedJobs,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 📌 Get all candidates who applied to the recruiter’s jobs
 * GET /api/job-applications/recruiter/applications
 */
/**
 * 📌 Recruiter can see all candidates who applied to their jobs
 * GET /api/job-applications/recruiter/applications
 */
/**
 * 📌 Recruiter can see all candidates who applied to their jobs
 * GET /api/job-applications/recruiter/applications
 */
// ✅ Get all applications for jobs created by logged-in recruiter
router.get(
  "/recruiter/applications",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const recruiterId =
        (req.user && (req.user as any).userId) ||
        req.user?._id ||
        req.user?.id ||
        req.user?.email;

      if (!recruiterId) {
        return res.status(401).json({ message: "Unauthorized recruiter" });
      }

      // ✅ 1️⃣ Find all jobs created by this recruiter
      const recruiterJobs = await Job.find({ createdBy: recruiterId }).select(
        "_id jobTitle companyName"
      );

      if (!recruiterJobs.length) {
        return res.status(200).json({
          success: true,
          message: "No jobs found for this recruiter",
          data: [],
        });
      }

      const jobIds = recruiterJobs.map((job) => job._id);

      // Find all applications for these jobs and populate User (not Candidate)
      const applications = await JobApplication.find({
        jobId: { $in: jobIds },
      })
        .populate({
          path: "candidateId",
          model: "User", //  changed to match your schema
          select: "name email phonenumber",
        })
        .populate({
          path: "jobId",
          model: "Job",
          select: "_id jobTitle companyName createdBy",
        })
        .lean();

      //  Group by job
      const formattedData = recruiterJobs.map((job) => {
        const jobApps = applications.filter(
          (app) =>
            app.jobId && String(app.jobId?._id) === String(job._id)
        );

        return {
          jobId: job._id,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          applicants: jobApps.map((app) => {
            const candidate = app.candidateId as
              | {
                  _id?: mongoose.Types.ObjectId;
                  name?: string;
                  email?: string;
                  phonenumber?: string;
                }
              | undefined;

            return {
              candidateId: candidate?._id || "",
              name: candidate?.name || "",
              email: candidate?.email || "",
              phonenumber: candidate?.phonenumber || "",
              appliedAt: app.appliedAt || app.createdAt || "",
              status: app.status || "Applied",
            };
          }),
        };
      });

      return res.status(200).json({
        success: true,
        count: formattedData.length,
        data: formattedData,
      });
    } catch (error) {
      console.error(" Error in recruiter applications:", error);
      next(error);
    }
  }
);



export default router;
