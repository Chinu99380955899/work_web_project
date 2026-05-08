"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResume = exports.uploadCSV = exports.getSignedUrl = exports.deleteFile = exports.uploadFile = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const errorHandler_1 = require("../middleware/errorHandler");
require("dotenv").config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "ap-south-1",
});
console.log({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "ap-south-1",
});
const s3 = new aws_sdk_1.default.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET || "recruitment-portal-bucket";
const uploadFile = async (file, folder = "uploads") => {
    try {
        if (!file) {
            throw new errorHandler_1.ApiError(400, "No file provided");
        }
        const timestamp = Date.now();
        const uniqueFileName = `${folder}/${timestamp}-${file.originalname.replace(/\s+/g, "-")}`;
        const params = {
            Bucket: BUCKET_NAME,
            Key: uniqueFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "private",
        };
        const result = await s3.upload(params).promise();
        return result.Location;
    }
    catch (error) {
        console.error("❌ S3 upload error:", error);
        throw new errorHandler_1.ApiError(500, "Failed to upload file to S3");
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (fileUrl) => {
    try {
        const key = fileUrl.split(`${BUCKET_NAME}/`)[1];
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
        };
        await s3.deleteObject(params).promise();
    }
    catch (error) {
        console.error("❌ S3 delete error:", error);
        throw new errorHandler_1.ApiError(500, "Failed to delete file from S3");
    }
};
exports.deleteFile = deleteFile;
const getSignedUrl = async (fileUrl, expiresIn = 3600) => {
    try {
        console.log('🔍 Generating signed URL for:', fileUrl);
        console.log('🔍 BUCKET_NAME:', BUCKET_NAME);
        const decodedUrl = decodeURIComponent(fileUrl);
        console.log('🔍 Decoded URL:', decodedUrl);
        let key;
        if (decodedUrl.includes(`${BUCKET_NAME}/`)) {
            key = decodedUrl.split(`${BUCKET_NAME}/`)[1];
        }
        else if (decodedUrl.includes("s3.amazonaws.com/")) {
            key = decodedUrl.split("s3.amazonaws.com/")[1].split("/").slice(1).join("/");
        }
        else if (decodedUrl.includes("s3.") && decodedUrl.includes(".amazonaws.com/")) {
            const urlParts = decodedUrl.split(".amazonaws.com/")[1];
            key = urlParts.split("/").slice(1).join("/");
        }
        else {
            key = decodedUrl;
        }
        if (!key) {
            throw new Error("Could not extract S3 key from URL");
        }
        key = key.split('?')[0];
        key = decodeURIComponent(key);
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
    }
    catch (error) {
        console.error("❌ S3 signed URL error:", error);
        throw new errorHandler_1.ApiError(500, "Failed to generate signed URL");
    }
};
exports.getSignedUrl = getSignedUrl;
const uploadCSV = async (file, folder = "csv") => {
    try {
        if (!file) {
            throw new errorHandler_1.ApiError(400, "No CSV file provided");
        }
        if (!file.mimetype.includes("csv")) {
            throw new errorHandler_1.ApiError(400, "Invalid file type. Only CSV files are allowed.");
        }
        const timestamp = Date.now();
        const uniqueFileName = `${folder}/${timestamp}-${file.originalname.replace(/\s+/g, "-")}`;
        const params = {
            Bucket: BUCKET_NAME,
            Key: uniqueFileName,
            Body: file.buffer,
            ContentType: "text/csv",
            ACL: "private",
        };
        const result = await s3.upload(params).promise();
        return result.Location;
    }
    catch (error) {
        console.error("❌ S3 CSV upload error:", error);
        throw new errorHandler_1.ApiError(500, "Failed to upload CSV file to S3");
    }
};
exports.uploadCSV = uploadCSV;
const uploadResume = async (file, folder = "resumes") => {
    try {
        if (!file) {
            throw new errorHandler_1.ApiError(400, "No resume file provided");
        }
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new errorHandler_1.ApiError(400, "Invalid file type. Only PDF and Word documents are allowed.");
        }
        const timestamp = Date.now();
        const sanitizedFileName = file.originalname
            .replace(/\s+/g, "-")
            .replace(/[()]/g, "")
            .replace(/[^a-zA-Z0-9.-]/g, "_");
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
    }
    catch (error) {
        console.error("❌ S3 resume upload error:", error);
        throw new errorHandler_1.ApiError(500, "Failed to upload resume to S3");
    }
};
exports.uploadResume = uploadResume;
//# sourceMappingURL=s3.js.map