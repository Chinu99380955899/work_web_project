import AWS from "aws-sdk";
import { ApiError } from "../middleware/errorHandler";
require("dotenv").config();
// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});

console.log({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ap-south-1",
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET || "recruitment-portal-bucket";

// Upload a file to S3
export const uploadFile = async (
  file: Express.Multer.File,
  folder: string = "uploads"
): Promise<string> => {
  try {
    if (!file) {
      throw new ApiError(400, "No file provided");
    }

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${folder}/${timestamp}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "private", // Keep files private
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error: any) {
    console.error("❌ S3 upload error:", error);
    throw new ApiError(500, "Failed to upload file to S3");
  }
};

// Delete a file from S3
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract key from URL
    const key = fileUrl.split(`${BUCKET_NAME}/`)[1];

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error: any) {
    console.error("❌ S3 delete error:", error);
    throw new ApiError(500, "Failed to delete file from S3");
  }
};

// Generate a presigned URL for temporary file access
export const getSignedUrl = async (
  fileUrl: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> => {
  try {
    console.log('🔍 Generating signed URL for:', fileUrl);
    console.log('🔍 BUCKET_NAME:', BUCKET_NAME);
    
    // Decode the URL first to handle encoded characters
    const decodedUrl = decodeURIComponent(fileUrl);
    console.log('🔍 Decoded URL:', decodedUrl);
    
    // Extract key from URL - handle different URL formats
    let key: string;

    // Robust Key Extraction: Get everything after the domain name
    if (decodedUrl.includes(".amazonaws.com/")) {
      // Handles virtually all S3 URL formats by taking everything after the domain
      const parts = decodedUrl.split(".amazonaws.com/");
      let potentialKey = parts[1];

      // If the bucket name is in the path (e.g., s3.region.amazonaws.com/bucket-name/key)
      // we remove the bucket name part.
      if (potentialKey.startsWith(`${BUCKET_NAME}/`)) {
        key = potentialKey.replace(`${BUCKET_NAME}/`, "");
      } else {
        key = potentialKey;
      }
    } else {
      key = decodedUrl;
    }

    if (!key) {
      throw new Error("Could not extract S3 key from URL");
    }

    // Remove any query parameters that might be attached to the key
    key = key.split('?')[0];

    // Clean up the key by removing any remaining encoded characters
    key = decodeURIComponent(key);

    // Ensure the key includes the folder prefix if it's missing
    if (key && !key.includes('/') && (key.includes('Resume') || key.includes('resume'))) {
      key = `resumes/${key}`;
    }

    console.log('🔍 Final extracted key:', key);

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    };

    return s3.getSignedUrl("getObject", params);
  } catch (error: any) {
    console.error("❌ S3 signed URL error:", error);
    throw new ApiError(500, "Failed to generate signed URL");
  }
};

// Upload a CSV file and return its URL
export const uploadCSV = async (
  file: Express.Multer.File,
  folder: string = "csv"
): Promise<string> => {
  try {
    if (!file) {
      throw new ApiError(400, "No CSV file provided");
    }

    // Validate file type
    if (!file.mimetype.includes("csv")) {
      throw new ApiError(400, "Invalid file type. Only CSV files are allowed.");
    }

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${folder}/${timestamp}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: "text/csv",
      ACL: "private",
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error: any) {
    console.error("❌ S3 CSV upload error:", error);
    throw new ApiError(500, "Failed to upload CSV file to S3");
  }
};

// Upload a resume file and return its URL
export const uploadResume = async (
  file: Express.Multer.File,
  folder: string = "resumes"
): Promise<string> => {
  try {
    if (!file) {
      throw new ApiError(400, "No resume file provided");
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ApiError(
        400,
        "Invalid file type. Only PDF and Word documents are allowed."
      );
    }

    // Generate unique file name with proper encoding
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[()]/g, "") // Remove parentheses
      .replace(/[^a-zA-Z0-9.-]/g, "_"); // Replace other special characters with underscores
    
    const uniqueFileName = `${folder}/${timestamp}-${sanitizedFileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "private",
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error: any) {
    console.error("❌ S3 resume upload error:", error);
    throw new ApiError(500, "Failed to upload resume to S3");
  }
};
