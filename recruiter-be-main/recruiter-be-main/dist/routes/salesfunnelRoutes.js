"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const Salesfunnel_1 = __importDefault(require("../models/Salesfunnel"));
const router = express_1.default.Router();
router.post("/", [
    (0, express_validator_1.body)("dateOfFunnelGeneration").notEmpty().withMessage("Date of Funnel Generation is required"),
    (0, express_validator_1.body)("accountManager").notEmpty().withMessage("Account Manager is required"),
    (0, express_validator_1.body)("lead").optional().trim(),
    (0, express_validator_1.body)("customerName").optional().trim(),
    (0, express_validator_1.body)("projectName").optional().trim(),
    (0, express_validator_1.body)("location").optional().trim(),
    (0, express_validator_1.body)("opportunityType").optional().trim(),
    (0, express_validator_1.body)("opportunityDescription").optional().trim(),
    (0, express_validator_1.body)("approximateValue").optional().isNumeric(),
    (0, express_validator_1.body)("status").optional().trim(),
    (0, express_validator_1.body)("expectedClosureMonth").optional().trim(),
    (0, express_validator_1.body)("projectedRevenue").optional().isNumeric(),
    (0, express_validator_1.body)("createdBy").notEmpty().withMessage("CreatedBy (User ID) is required"),
], async (req, res, next) => {
    try {
        const funnel = await Salesfunnel_1.default.create(req.body);
        res.status(201).json({
            success: true,
            message: "Sales funnel created successfully",
            data: funnel,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", async (req, res, next) => {
    try {
        const funnels = await Salesfunnel_1.default.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: funnels.length,
            data: funnels,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const funnel = await Salesfunnel_1.default.findById(req.params.id);
        if (!funnel)
            throw new errorHandler_1.ApiError(404, "Sales Funnel not found");
        res.json({
            success: true,
            data: funnel,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get("/my-salesfunnels/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const mysalesFunnels = await Salesfunnel_1.default.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: mysalesFunnels.length,
            data: mysalesFunnels,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user sales funnels", error });
    }
});
router.patch("/:id", async (req, res, next) => {
    try {
        const funnel = await Salesfunnel_1.default.findById(req.params.id);
        if (!funnel)
            throw new errorHandler_1.ApiError(404, "Sales Funnel not found");
        Object.assign(funnel, req.body);
        await funnel.save();
        res.json({
            success: true,
            message: "Sales funnel updated successfully",
            data: funnel,
        });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        const funnel = await Salesfunnel_1.default.findByIdAndDelete(req.params.id);
        if (!funnel)
            throw new errorHandler_1.ApiError(404, "Sales Funnel not found");
        res.json({
            success: true,
            message: "Sales funnel deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=salesfunnelRoutes.js.map