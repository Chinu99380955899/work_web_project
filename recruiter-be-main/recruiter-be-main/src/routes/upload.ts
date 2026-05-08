import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { authenticate, requirePermission } from "../middleware/auth";
import { uploadResume, uploadCSV } from "../utils/s3";
import { ApiError } from "../middleware/errorHandler";
import { processCSV } from "../services/csvService";
import { parseResume } from "../services/resumeService";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload resume
router.post(
  "/resume",
  authenticate,
  upload.single("resume"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ApiError(400, "No resume file provided");
      }

      const fileUrl = await uploadResume(req.file);

      res.json({
        success: true,
        message: "Resume uploaded successfully",
        fileUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Parse resume and extract information
router.post(
  "/parse-resume",
  authenticate,
  upload.single("resume"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ApiError(400, "No resume file provided");
      }

      // Parse resume and extract information
      const parsedData = await parseResume(req.file);

      res.json({
        success: true,
        message: "Resume parsed successfully",
        data: parsedData,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload CSV for bulk candidate import
router.post(
  "/bulk-candidates",
  authenticate,
  requirePermission("bulk_upload"),
  upload.fields([
    { name: "csv", maxCount: 1 },
    { name: "resumes", maxCount: 50 }, // Allow up to 50 resume files
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files.csv || !files.csv[0]) {
        throw new ApiError(400, "No CSV file provided");
      }

      const csvFile = files.csv[0];
      const resumeFiles: { [key: string]: Express.Multer.File } = {};

      // Process resume files if provided
      if (files.resumes) {
        files.resumes.forEach((file) => {
          // Use filename without extension as key
          const key = file.originalname.replace(/\.[^/.]+$/, "");
          resumeFiles[key] = file;
        });
      }

      // Upload CSV to S3
      const fileUrl = await uploadCSV(csvFile);

      // Process CSV and create candidates with resume files
      const result = await processCSV(csvFile.buffer, resumeFiles);

      res.json({
        success: true,
        message: "CSV processed successfully",
        fileUrl,
        summary: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
