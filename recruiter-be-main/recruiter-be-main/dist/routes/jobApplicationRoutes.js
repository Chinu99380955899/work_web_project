"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
const Job_1 = __importDefault(require("../models/Job"));
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
router.post("/job/apply", auth_1.authenticate, async (req, res, next) => {
    try {
        const { jobId } = req.body;
        const candidateId = (req.user && req.user.userId) || req.user?._id || req.user?.id;
        if (!jobId)
            throw new errorHandler_1.ApiError(400, "Job ID is required");
        if (!candidateId)
            throw new errorHandler_1.ApiError(401, "Unauthorized user");
        const job = await Job_1.default.findById(jobId);
        if (!job)
            throw new errorHandler_1.ApiError(404, "Job not found");
        const existingApplication = await JobApplication_1.default.findOne({
            jobId,
            candidateId,
        });
        if (existingApplication)
            throw new errorHandler_1.ApiError(400, "Already applied for this job");
        const newApplication = await JobApplication_1.default.create({
            jobId,
            candidateId,
            appliedAt: new Date(),
        });
        res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            data: newApplication,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/my-applications", auth_1.authenticate, async (req, res, next) => {
    try {
        const candidateId = (req.user && req.user.userId) || req.user?._id || req.user?.id;
        if (!candidateId)
            throw new errorHandler_1.ApiError(401, "Unauthorized user");
        const applications = await JobApplication_1.default.find({ candidateId }).populate("jobId");
        const appliedJobs = applications.map((app) => {
            const job = app.jobId;
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
    }
    catch (error) {
        next(error);
    }
});
router.get("/recruiter/applications", auth_1.authenticate, async (req, res, next) => {
    try {
        const recruiterId = (req.user && req.user.userId) ||
            req.user?._id ||
            req.user?.id ||
            req.user?.email;
        if (!recruiterId) {
            return res.status(401).json({ message: "Unauthorized recruiter" });
        }
        const recruiterJobs = await Job_1.default.find({ createdBy: recruiterId }).select("_id jobTitle companyName");
        if (!recruiterJobs.length) {
            return res.status(200).json({
                success: true,
                message: "No jobs found for this recruiter",
                data: [],
            });
        }
        const jobIds = recruiterJobs.map((job) => job._id);
        const applications = await JobApplication_1.default.find({
            jobId: { $in: jobIds },
        })
            .populate({
            path: "candidateId",
            model: "User",
            select: "name email phonenumber",
        })
            .populate({
            path: "jobId",
            model: "Job",
            select: "_id jobTitle companyName createdBy",
        })
            .lean();
        const formattedData = recruiterJobs.map((job) => {
            const jobApps = applications.filter((app) => app.jobId && String(app.jobId?._id) === String(job._id));
            return {
                jobId: job._id,
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                applicants: jobApps.map((app) => {
                    const candidate = app.candidateId;
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
    }
    catch (error) {
        console.error(" Error in recruiter applications:", error);
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=jobApplicationRoutes.js.map