"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const User_1 = __importDefault(require("../models/User"));
const otpService_1 = require("../services/otpService");
const router = express_1.default.Router();
router.post("/recruiters", auth_1.authenticate, auth_1.adminOnly, [
    (0, express_validator_1.body)("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .custom((value) => {
        if (!(0, otpService_1.isValidPhoneNumber)(value)) {
            throw new Error("Invalid phone number format");
        }
        return true;
    }),
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("permissions")
        .isArray()
        .withMessage("Permissions must be an array")
        .custom((value) => {
        const validPermissions = [
            "bulk_upload",
            "single_upload",
            "export",
            "search",
            "manage_recruiters",
            "manage_trackers",
            'funnel_data',
            'sales_funnel_data',
            'job_post',
        ];
        return value.every((permission) => validPermissions.includes(permission));
    })
        .withMessage("Invalid permissions"),
], async (req, res, next) => {
    try {
        const { phoneNumber, email, permissions } = req.body;
        const formattedPhoneNumber = (0, otpService_1.formatPhoneNumber)(phoneNumber);
        const existingUser = await User_1.default.findOne({
            $or: [{ phoneNumber: formattedPhoneNumber }, { email }],
        });
        if (existingUser) {
            throw new errorHandler_1.ApiError(400, "User already exists with this phone number or email");
        }
        const recruiter = await User_1.default.create({
            phoneNumber: formattedPhoneNumber,
            email,
            role: "recruiter",
            permissions,
            isVerified: true,
            createdBy: req.user?._id,
        });
        res.json({
            success: true,
            message: "Recruiter account created successfully",
            recruiter,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/recruiters", auth_1.authenticate, auth_1.adminOnly, async (req, res, next) => {
    try {
        const recruiters = await User_1.default.find({
            role: "recruiter",
            isActive: true,
        }).select("-__v");
        res.json({
            success: true,
            recruiters,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/recruiters/:id", auth_1.authenticate, auth_1.adminOnly, [
    (0, express_validator_1.body)("permissions")
        .isArray()
        .withMessage("Permissions must be an array")
        .custom((value) => {
        const validPermissions = [
            "bulk_upload",
            "single_upload",
            "export",
            "search",
            "manage_recruiters",
            "manage_trackers",
            "funnel_data",
            "sales_funnel_data",
            "job_post"
        ];
        return value.every((permission) => validPermissions.includes(permission));
    })
        .withMessage("Invalid permissions"),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean"),
], async (req, res, next) => {
    try {
        const { id } = req.params;
        const { permissions, isActive } = req.body;
        const recruiter = await User_1.default.findOne({
            _id: id,
            role: "recruiter",
        });
        if (!recruiter) {
            throw new errorHandler_1.ApiError(404, "Recruiter not found");
        }
        if (permissions) {
            recruiter.permissions = permissions;
        }
        if (typeof isActive === "boolean") {
            recruiter.isActive = isActive;
        }
        await recruiter.save();
        res.json({
            success: true,
            message: "Recruiter updated successfully",
            recruiter,
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/recruiters/:id", auth_1.authenticate, auth_1.adminOnly, async (req, res, next) => {
    try {
        const { id } = req.params;
        const recruiter = await User_1.default.findOne({
            _id: id,
            role: "recruiter",
        });
        if (!recruiter) {
            throw new errorHandler_1.ApiError(404, "Recruiter not found");
        }
        recruiter.isActive = false;
        await recruiter.save();
        res.json({
            success: true,
            message: "Recruiter deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/stats", auth_1.authenticate, auth_1.adminOnly, async (req, res, next) => {
    try {
        const stats = {
            users: {
                total: await User_1.default.countDocuments(),
                candidates: await User_1.default.countDocuments({ role: "candidate" }),
                recruiters: await User_1.default.countDocuments({
                    role: "recruiter",
                    isActive: true,
                }),
                admins: await User_1.default.countDocuments({ role: "admin" }),
            },
            activity: {
                activeUsers: await User_1.default.countDocuments({
                    lastLogin: {
                        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                }),
                verifiedUsers: await User_1.default.countDocuments({ isVerified: true }),
            },
        };
        res.json({
            success: true,
            stats,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map