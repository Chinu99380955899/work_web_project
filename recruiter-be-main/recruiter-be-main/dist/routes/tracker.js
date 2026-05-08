"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const Tracker_1 = __importDefault(require("../models/Tracker"));
const router = express_1.default.Router();
router.post("/", auth_1.authenticate, (0, auth_1.requirePermission)("manage_trackers"), [
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Tracker name is required"),
    (0, express_validator_1.body)("fields").isArray().withMessage("Fields must be an array"),
    (0, express_validator_1.body)("fields.*.candidateField")
        .notEmpty()
        .withMessage("Candidate field is required"),
    (0, express_validator_1.body)("fields.*.displayName")
        .notEmpty()
        .withMessage("Display name is required"),
    (0, express_validator_1.body)("fields.*.order").isNumeric().withMessage("Order must be a number"),
], async (req, res, next) => {
    try {
        const { name, description, companyName, fields, isDefault } = req.body;
        const tracker = await Tracker_1.default.create({
            name,
            description,
            companyName,
            fields: fields.map((field, index) => ({
                ...field,
                order: field.order || index + 1,
            })),
            isDefault: isDefault || false,
            createdBy: req.user?._id,
        });
        res.json({
            success: true,
            message: "Tracker created successfully",
            tracker,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", auth_1.authenticate, (0, auth_1.requirePermission)("export"), async (req, res, next) => {
    try {
        const trackers = await Tracker_1.default.find({
            $or: [{ createdBy: req.user?._id }, { isDefault: true }],
            isActive: true,
        }).sort({ usageCount: -1 });
        res.json({
            success: true,
            trackers,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", auth_1.authenticate, (0, auth_1.requirePermission)("export"), async (req, res, next) => {
    try {
        const tracker = await Tracker_1.default.findOne({
            _id: req.params.id,
            $or: [{ createdBy: req.user?._id }, { isDefault: true }],
            isActive: true,
        });
        if (!tracker) {
            throw new errorHandler_1.ApiError(404, "Tracker not found");
        }
        res.json({
            success: true,
            tracker,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/:id", auth_1.authenticate, (0, auth_1.requirePermission)("manage_trackers"), [
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Tracker name cannot be empty"),
    (0, express_validator_1.body)("fields").optional().isArray().withMessage("Fields must be an array"),
    (0, express_validator_1.body)("fields.*.candidateField")
        .optional()
        .notEmpty()
        .withMessage("Candidate field is required"),
    (0, express_validator_1.body)("fields.*.displayName")
        .optional()
        .notEmpty()
        .withMessage("Display name is required"),
    (0, express_validator_1.body)("fields.*.order")
        .optional()
        .isNumeric()
        .withMessage("Order must be a number"),
], async (req, res, next) => {
    try {
        const tracker = await Tracker_1.default.findOne({
            _id: req.params.id,
            createdBy: req.user?._id,
            isActive: true,
        });
        if (!tracker) {
            throw new errorHandler_1.ApiError(404, "Tracker not found");
        }
        const { name, description, companyName, fields, isDefault } = req.body;
        if (name)
            tracker.name = name;
        if (description !== undefined)
            tracker.description = description;
        if (companyName !== undefined)
            tracker.companyName = companyName;
        if (fields) {
            tracker.fields = fields.map((field, index) => ({
                ...field,
                order: field.order || index + 1,
            }));
        }
        if (isDefault !== undefined)
            tracker.isDefault = isDefault;
        await tracker.save();
        res.json({
            success: true,
            message: "Tracker updated successfully",
            tracker,
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", auth_1.authenticate, (0, auth_1.requirePermission)("manage_trackers"), async (req, res, next) => {
    try {
        const tracker = await Tracker_1.default.findOne({
            _id: req.params.id,
            createdBy: req.user?._id,
        });
        if (!tracker) {
            throw new errorHandler_1.ApiError(404, "Tracker not found");
        }
        tracker.isActive = false;
        await tracker.save();
        res.json({
            success: true,
            message: "Tracker deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=tracker.js.map