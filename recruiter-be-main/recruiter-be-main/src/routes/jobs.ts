import { Router, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import Job, { IJob } from "../models/Job";
import { authenticate, AuthenticatedRequest } from "../middleware/auth"; // ✅ correct import

const router = Router();

/* --------------------------------------------
   ✅ Validation rules for Job creation/update
--------------------------------------------- */
const jobValidation = [
  body("companyName").notEmpty().withMessage("Company name is required"),
  body("jobTitle").notEmpty().withMessage("Job title is required"),
  body("minExp").optional().isNumeric().withMessage("minExp must be a number"),
  body("maxExp").optional().isNumeric().withMessage("maxExp must be a number"),
  body("minSalary").optional().isNumeric().withMessage("minSalary must be a number"),
  body("maxSalary").optional().isNumeric().withMessage("maxSalary must be a number"),
];

/* --------------------------------------------
   ✅ POST /api/jobs — Create a new job (auth required)
--------------------------------------------- */
router.post(
  "/",
  authenticate, // 🔒 Require login
  jobValidation,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        maxSalary,
      } = req.body;

      // ✅ Track which user created this job
      const createdBy = req.user?._id || req.user?.email;

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
        maxSalary: maxSalary ? Number(maxSalary) : undefined,
        createdBy,
      });

      const savedJob = await job.save();

      res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: savedJob,
      });
    } catch (err) {
      next(err);
    }
  }
);

/* --------------------------------------------
   ✅ GET /api/jobs — Fetch all jobs
--------------------------------------------- */
router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const jobs: IJob[] = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------------------
   ✅ GET /api/jobs/my-jobs — Fetch logged-in user’s jobs
--------------------------------------------- */
router.get("/my-jobs", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id || req.user?.email;
    const jobs = await Job.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------------------
   ✅ GET /api/jobs/:id — Get single job by ID
--------------------------------------------- */
router.get("/:id", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------------------
   ✅ PUT /api/jobs/:id — Update job (only by creator)
--------------------------------------------- */
router.put("/:id", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ✅ ensure only creator can update
    if (job.createdBy?.toString() !== (req.user?._id?.toString() || req.user?.email)) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ success: true, message: "Job updated successfully", data: job });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------------------
    DELETE /api/jobs/:id — Delete job (only by creator)
--------------------------------------------- */
router.delete("/:id", authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // ✅ ensure only creator can delete
    if (job.createdBy?.toString() !== (req.user?._id?.toString() || req.user?.email)) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------------------
   ✅ GET /api/jobs/applications — Fetch all applications for recruiter’s jobs
--------------------------------------------- */
// router.get(
//   "/applications",
//   authenticate,
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//       const recruiterId =
//         (req.user && (req.user as any).userId) ||
//         req.user?._id ||
//         req.user?.id ||
//         req.user?.email;

//       if (!recruiterId)
//         return res.status(401).json({ message: "Unauthorized recruiter" });

//       // ✅ Find all jobs created by this recruiter and populate applicants
//       const jobs = await Job.find({ createdBy: recruiterId }).populate({
//         path: "applicants.userId",
//         select: "name email phonenumber",
//       });

//       if (!jobs || jobs.length === 0) {
//         return res.status(200).json({
//           success: true,
//           message: "No job applications found for your posted jobs",
//           data: [],
//         });
//       }

//       // ✅ Format response neatly
//       const recruiterApplications = jobs.map((job) => ({
//         jobId: job._id,
//         jobTitle: job.jobTitle,
//         companyName: job.companyName,
//         location: job.location,
//         salaryRange: `${job.minSalary || 0} - ${job.maxSalary || 0}`,
//         applicants: job.applicants.map((app: any) => ({
//           applicantId: app.userId?._id,
//           name: app.userId?.name,
//           email: app.userId?.email,
//           phonenumber: app.userId?.phonenumber,
//           appliedAt: app.appliedAt,
//         })),
//       }));

//       res.status(200).json({
//         success: true,
//         count: recruiterApplications.length,
//         data: recruiterApplications,
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );


export default router;
