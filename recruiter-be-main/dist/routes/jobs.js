"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Job_1 = __importDefault(require("../models/Job"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const jobValidation = [
    (0, express_validator_1.body)("companyName").notEmpty().withMessage("Company name is required"),
    (0, express_validator_1.body)("jobTitle").notEmpty().withMessage("Job title is required"),
    (0, express_validator_1.body)("minExp").optional().isNumeric().withMessage("minExp must be a number"),
    (0, express_validator_1.body)("maxExp").optional().isNumeric().withMessage("maxExp must be a number"),
    (0, express_validator_1.body)("minSalary").optional().isNumeric().withMessage("minSalary must be a number"),
    (0, express_validator_1.body)("maxSalary").optional().isNumeric().withMessage("maxSalary must be a number"),
];
router.post("/", auth_1.authenticate, jobValidation, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { companyName, jobTitle, jobDescription, skills, location, minExp, maxExp, minSalary, maxSalary, } = req.body;
        const createdBy = req.user?._id || req.user?.email;
        const job = new Job_1.default({
            companyName,
            jobTitle,
            jobDescription,
            skills: Array.isArray(skills)
                ? skills.map((s) => s.trim()).filter(Boolean)
                : typeof skills === "string"
                    ? skills.split(",").map((s) => s.trim()).filter(Boolean)
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
    }
    catch (err) {
        next(err);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const jobs = await Job_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, count: jobs.length, data: jobs });
    }
    catch (err) {
        next(err);
    }
});
router.get("/my-jobs", auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.email;
        const jobs = await Job_1.default.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.json({ success: true, count: jobs.length, data: jobs });
    }
    catch (err) {
        next(err);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        res.json({ success: true, data: job });
    }
    catch (err) {
        next(err);
    }
});
router.put("/:id", auth_1.authenticate, async (req, res, next) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        if (job.createdBy?.toString() !== (req.user?._id?.toString() || req.user?.email)) {
            return res.status(403).json({ message: "Not authorized to update this job" });
        }
        Object.assign(job, req.body);
        await job.save();
        res.json({ success: true, message: "Job updated successfully", data: job });
    }
    catch (err) {
        next(err);
    }
});
router.delete("/:id", auth_1.authenticate, async (req, res, next) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        if (job.createdBy?.toString() !== (req.user?._id?.toString() || req.user?.email)) {
            return res.status(403).json({ message: "Not authorized to delete this job" });
        }
        await job.deleteOne();
        res.json({ success: true, message: "Job deleted successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=jobs.js.map