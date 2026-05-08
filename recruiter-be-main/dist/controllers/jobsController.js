"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const express_validator_1 = require("express-validator");
const Job_1 = __importDefault(require("../models/Job"));
const createJob = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { companyName, jobTitle, jobDescription, skills, location, minExp, maxExp, minSalary, maxSalary } = req.body;
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
            maxSalary: maxSalary ? Number(maxSalary) : undefined
        });
        const savedJob = await job.save();
        return res.status(201).json(savedJob);
    }
    catch (err) {
        next(err);
    }
};
exports.createJob = createJob;
const getJobs = async (req, res, next) => {
    try {
        const jobs = await Job_1.default.find().sort({ createdAt: -1 });
        res.json(jobs);
    }
    catch (err) {
        next(err);
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res, next) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        res.json(job);
    }
    catch (err) {
        next(err);
    }
};
exports.getJobById = getJobById;
const updateJob = async (req, res, next) => {
    try {
        const job = await Job_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        res.json(job);
    }
    catch (err) {
        next(err);
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res, next) => {
    try {
        const job = await Job_1.default.findByIdAndDelete(req.params.id);
        if (!job)
            return res.status(404).json({ message: "Job not found" });
        res.json({ message: "Job deleted" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteJob = deleteJob;
//# sourceMappingURL=jobsController.js.map