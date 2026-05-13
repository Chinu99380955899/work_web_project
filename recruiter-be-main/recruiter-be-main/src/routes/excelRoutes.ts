import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as xlsx from "xlsx";
import { uploadFile } from "../utils/s3";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and Parse Excel
router.post("/upload", authenticate, upload.single("excel"), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // 1. Upload the raw file to S3 for storage
    const s3Location = await uploadFile(req.file, "excel-sessions");

    // 2. Parse the Excel file from the buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({
      success: true,
      message: "Excel session uploaded and parsed",
      data: sheetData, // Preview data
      fileUrl: s3Location
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing Excel", error });
  }
});

export default router;