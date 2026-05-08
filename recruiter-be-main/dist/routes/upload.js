"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const s3_1 = require("../utils/s3");
const errorHandler_1 = require("../middleware/errorHandler");
const csvService_1 = require("../services/csvService");
const resumeService_1 = require("../services/resumeService");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
router.post("/resume", auth_1.authenticate, upload.single("resume"), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.ApiError(400, "No resume file provided");
        }
        const fileUrl = await (0, s3_1.uploadResume)(req.file);
        res.json({
            success: true,
            message: "Resume uploaded successfully",
            fileUrl,
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/parse-resume", auth_1.authenticate, upload.single("resume"), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.ApiError(400, "No resume file provided");
        }
        const parsedData = await (0, resumeService_1.parseResume)(req.file);
        res.json({
            success: true,
            message: "Resume parsed successfully",
            data: parsedData,
        });
    }
    catch (error) {
        next(error);
    }
});
router.post("/bulk-candidates", auth_1.authenticate, (0, auth_1.requirePermission)("bulk_upload"), upload.fields([
    { name: "csv", maxCount: 1 },
    { name: "resumes", maxCount: 50 },
]), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files.csv || !files.csv[0]) {
            throw new errorHandler_1.ApiError(400, "No CSV file provided");
        }
        const csvFile = files.csv[0];
        const resumeFiles = {};
        if (files.resumes) {
            files.resumes.forEach((file) => {
                const key = file.originalname.replace(/\.[^/.]+$/, "");
                resumeFiles[key] = file;
            });
        }
        const fileUrl = await (0, s3_1.uploadCSV)(csvFile);
        const result = await (0, csvService_1.processCSV)(csvFile.buffer, resumeFiles);
        res.json({
            success: true,
            message: "CSV processed successfully",
            fileUrl,
            summary: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map