"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const Candidate_1 = __importDefault(require("../models/Candidate"));
const csvService_1 = require("../services/csvService");
const Tracker_1 = __importDefault(require("../models/Tracker"));
const s3_1 = require("../utils/s3");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.post("/", auth_1.authenticate, [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),
], async (req, res, next) => {
    try {
        const candidateData = {
            ...req.body,
            userId: req.user?._id,
        };
        let candidate = await Candidate_1.default.findOne({
            userId: req.user?._id,
        });
        if (candidate) {
            Object.assign(candidate, candidateData);
            await candidate.save();
        }
        else {
            candidate = await Candidate_1.default.create(candidateData);
        }
        res.json({
            success: true,
            message: "Candidate profile saved successfully",
            candidate,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", auth_1.authenticate, (0, auth_1.requirePermission)("search"), async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const candidate = await Candidate_1.default.findById(id);
        if (!candidate) {
            throw new errorHandler_1.ApiError(404, "Candidate not found");
        }
        Object.assign(candidate, updateData);
        await candidate.save();
        res.json({
            success: true,
            message: "Candidate updated successfully",
            candidate,
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/upload", auth_1.authenticate, (0, auth_1.requirePermission)("single_upload"), [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),
    (0, express_validator_1.body)("jobTitle").optional().trim(),
    (0, express_validator_1.body)("currentLocation").optional().trim(),
    (0, express_validator_1.body)("preferredLocations").optional().isArray(),
    (0, express_validator_1.body)("totalExperience").optional().isNumeric(),
    (0, express_validator_1.body)("organization").optional().trim(),
    (0, express_validator_1.body)("designation").optional().trim(),
    (0, express_validator_1.body)("startDate").optional().trim(),
    (0, express_validator_1.body)("endDate").optional().trim(),
    (0, express_validator_1.body)("currentCompanyName").optional().trim(),
    (0, express_validator_1.body)("currentCompanyDesignation").optional().trim(),
    (0, express_validator_1.body)("department").optional().trim(),
    (0, express_validator_1.body)("role").optional().trim(),
    (0, express_validator_1.body)("industry").optional().trim(),
    (0, express_validator_1.body)("keySkills").optional().isArray(),
    (0, express_validator_1.body)("annualSalary").optional().isNumeric(),
    (0, express_validator_1.body)("noticePeriod").optional().trim(),
    (0, express_validator_1.body)("resumeHeadline").optional().trim(),
    (0, express_validator_1.body)("summary").optional().trim(),
    (0, express_validator_1.body)("tenthSchool").optional().trim(),
    (0, express_validator_1.body)("tenthBoard").optional().trim(),
    (0, express_validator_1.body)("tenthCgpa").optional().trim(),
    (0, express_validator_1.body)("tenthpassingyear").optional().trim(),
    (0, express_validator_1.body)("twelfthSchool").optional().trim(),
    (0, express_validator_1.body)("twelfthBoard").optional().trim(),
    (0, express_validator_1.body)("twelfthCgpa").optional().trim(),
    (0, express_validator_1.body)("twelfthpassingyear").optional().trim(),
    (0, express_validator_1.body)("ugDegree").optional().trim(),
    (0, express_validator_1.body)("ugSpecialization").optional().trim(),
    (0, express_validator_1.body)("ugUniversity").optional().trim(),
    (0, express_validator_1.body)("ugGraduationYear").optional().isNumeric(),
    (0, express_validator_1.body)("pgDegree").optional().trim(),
    (0, express_validator_1.body)("pgSpecialization").optional().trim(),
    (0, express_validator_1.body)("pgUniversity").optional().trim(),
    (0, express_validator_1.body)("pgGraduationYear").optional().isNumeric(),
    (0, express_validator_1.body)("doctorateDegree").optional().trim(),
    (0, express_validator_1.body)("doctorateSpecialization").optional().trim(),
    (0, express_validator_1.body)("doctorateUniversity").optional().trim(),
    (0, express_validator_1.body)("doctorateGraduationYear").optional().isNumeric(),
    (0, express_validator_1.body)("certificationsname").optional().isNumeric(),
    (0, express_validator_1.body)("certificationID").optional().isNumeric(),
    (0, express_validator_1.body)("certificationStartDate").optional().isNumeric(),
    (0, express_validator_1.body)("certificationEndDate").optional().isNumeric(),
    (0, express_validator_1.body)("gender").optional().trim(),
    (0, express_validator_1.body)("maritalStatus").optional().trim(),
    (0, express_validator_1.body)("homeTown").optional().trim(),
    (0, express_validator_1.body)("pinCode").optional().trim(),
    (0, express_validator_1.body)("workPermitUSA").optional().isBoolean(),
    (0, express_validator_1.body)("dateOfBirth").optional().isISO8601(),
    (0, express_validator_1.body)("permanentAddress").optional().trim(),
], async (req, res, next) => {
    try {
        const candidateData = {
            ...req.body,
            uploadedBy: req.user?._id,
            dateOfApplication: new Date(),
            lastWorkflowActivity: "Uploaded",
            lastWorkflowActivityBy: req.user?._id,
            timeOfLastWorkflowActivityUpdate: new Date(),
            latestPipelineStage: "New",
            pipelineStatusUpdatedBy: req.user?._id,
            timeWhenStageUpdated: new Date(),
        };
        const existingCandidate = await Candidate_1.default.findOne({
            $or: [
                { email: candidateData.email },
                { phoneNumber: candidateData.phoneNumber },
            ],
        });
        const user = await User_1.default.create({
            phoneNumber: candidateData.phoneNumber,
            role: "candidate",
            isVerified: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        candidateData.userId = user._id;
        if (existingCandidate) {
            throw new errorHandler_1.ApiError(400, "Candidate already exists with this email or phone number");
        }
        const candidate = await Candidate_1.default.create(candidateData);
        res.json({
            success: true,
            message: "Candidate uploaded successfully",
            candidate,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/me", auth_1.authenticate, async (req, res, next) => {
    try {
        const candidate = await Candidate_1.default.findOne({
            userId: req.user?._id,
        });
        if (!candidate) {
            throw new errorHandler_1.ApiError(404, "Candidate profile not found");
        }
        let candidateWithSignedUrl = candidate.toObject();
        if (candidate.resumeUrl) {
            try {
                candidateWithSignedUrl.resumeUrl = await (0, s3_1.getSignedUrl)(candidate.resumeUrl, 3600);
            }
            catch (error) {
                console.error("Failed to generate signed URL for resume:", error);
                candidateWithSignedUrl.resumeUrl = undefined;
            }
        }
        res.json({
            success: true,
            candidate: candidateWithSignedUrl,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/search", auth_1.authenticate, (0, auth_1.requirePermission)("search"), async (req, res, next) => {
    try {
        const { location, role, skills, experience, salary, page = 1, limit = 10, } = req.query;
        const query = { isActive: true };
        if (location) {
            query.$or = [
                { currentLocation: { $regex: location, $options: "i" } },
                { preferredLocations: { $regex: location, $options: "i" } },
            ];
        }
        if (role) {
            query.role = { $regex: role, $options: "i" };
        }
        if (skills) {
            const skillsArray = Array.isArray(skills)
                ? skills
                : skills.split(",");
            query.keySkills = {
                $in: skillsArray
                    .filter((skill) => typeof skill === "string" && skill.trim().length > 0)
                    .map((skill) => new RegExp(skill.trim(), "i")),
            };
        }
        if (experience) {
            const [min, max] = experience.split("-").map(Number);
            query.totalExperience = { $gte: min, $lte: max };
        }
        if (salary) {
            const [min, max] = salary.split("-").map(Number);
            query.annualSalary = { $gte: min, $lte: max };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const candidates = await Candidate_1.default.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ dateOfApplication: -1 });
        const total = await Candidate_1.default.countDocuments(query);
        const candidatesWithSignedUrls = await Promise.all(candidates.map(async (candidate) => {
            const candidateObj = candidate.toObject();
            if (candidateObj.resumeUrl) {
                try {
                    candidateObj.resumeUrl = await (0, s3_1.getSignedUrl)(candidateObj.resumeUrl, 3600);
                }
                catch (error) {
                    console.error("Failed to generate signed URL for resume:", error);
                    candidateObj.resumeUrl = undefined;
                }
            }
            return candidateObj;
        }));
        res.json({
            success: true,
            candidates: candidatesWithSignedUrls,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/export", auth_1.authenticate, (0, auth_1.requirePermission)("export"), [
    (0, express_validator_1.body)("trackerId").notEmpty().withMessage("Tracker ID is required"),
    (0, express_validator_1.body)("candidateIds")
        .isArray()
        .withMessage("Candidate IDs must be an array"),
], async (req, res, next) => {
    try {
        const { trackerId, candidateIds } = req.body;
        const tracker = await Tracker_1.default.findById(trackerId);
        if (!tracker) {
            throw new errorHandler_1.ApiError(404, "Tracker not found");
        }
        const candidates = await Candidate_1.default.find({
            _id: { $in: candidateIds },
        });
        const csv = await (0, csvService_1.exportToCSV)(candidates, tracker.fields);
        tracker.usageCount += 1;
        tracker.lastUsed = new Date();
        await tracker.save();
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=candidates-${Date.now()}.csv`);
        res.send(csv);
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id/workflow", auth_1.authenticate, (0, auth_1.requirePermission)("search"), [
    (0, express_validator_1.body)("stage").notEmpty().withMessage("Pipeline stage is required"),
    (0, express_validator_1.body)("comment").optional().trim(),
], async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stage, comment } = req.body;
        const candidate = await Candidate_1.default.findById(id);
        if (!candidate) {
            throw new errorHandler_1.ApiError(404, "Candidate not found");
        }
        candidate.lastWorkflowActivity = "Stage Update";
        candidate.lastWorkflowActivityBy = req.user?._id;
        candidate.timeOfLastWorkflowActivityUpdate = new Date();
        candidate.latestPipelineStage = stage;
        candidate.pipelineStatusUpdatedBy = req.user?._id;
        candidate.timeWhenStageUpdated = new Date();
        if (comment) {
            candidate.comments.push({
                text: comment,
                commentBy: req.user?._id,
                timePosted: new Date(),
            });
        }
        await candidate.save();
        res.json({
            success: true,
            message: "Workflow status updated successfully",
            candidate,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        let candidate = await Candidate_1.default.findById(id);
        if (!candidate) {
            candidate = await Candidate_1.default.findOne({ userId: id });
        }
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: "Candidate not found",
            });
        }
        const candidateObj = candidate.toObject();
        if (candidateObj.resumeUrl) {
            try {
                console.log("🟢 Generating signed resume URL for:", candidateObj.resumeUrl);
                const signedUrl = await (0, s3_1.getSignedUrl)(candidateObj.resumeUrl, 3600);
                candidateObj.resumeUrl = signedUrl;
            }
            catch (err) {
                console.error("❌ Failed to sign resume URL:", err);
            }
        }
        res.status(200).json({
            success: true,
            candidate: candidateObj,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=candidate.js.map