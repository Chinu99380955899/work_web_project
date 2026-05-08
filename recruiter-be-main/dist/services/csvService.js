"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCSV = exports.processCSV = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const Candidate_1 = __importDefault(require("../models/Candidate"));
const otpService_1 = require("./otpService");
const s3_1 = require("../utils/s3");
const fieldMapping = {
    "Job Title": "jobTitle",
    "Date of application": "dateOfApplication",
    Name: "name",
    "Email ID": "email",
    "Phone Number": "phoneNumber",
    Pan: "pan",
    "Current Location": "currentLocation",
    "Preferred Locations": "preferredLocations",
    "Total Experience": "totalExperience",
    "Curr. Company name": "currentCompanyName",
    "Curr. Company Designation": "currentCompanyDesignation",
    Department: "department",
    Role: "role",
    Industry: "industry",
    "Key Skills": "keySkills",
    "Annual Salary": "annualSalary",
    "Notice period/ Availability to join": "noticePeriod",
    "Resume Headline": "resumeHeadline",
    Summary: "summary",
    "Under Graduation degree": "ugDegree",
    "UG Specialization": "ugSpecialization",
    "UG University/institute Name": "ugUniversity",
    "UG Graduation year": "ugGraduationYear",
    "Post graduation degree": "pgDegree",
    "PG specialization": "pgSpecialization",
    "PG university/institute name": "pgUniversity",
    "PG graduation year": "pgGraduationYear",
    "Doctorate degree": "doctorateeDegree",
    "Doctorate specialization": "doctorateSpecialization",
    "Doctorate university/institute name": "doctorateUniversity",
    "Doctorate graduation year": "doctorateGraduationYear",
    Gender: "gender",
    "Marital Status": "maritalStatus",
    "Home Town/City": "homeTown",
    "Pin Code": "pinCode",
    "Work permit for USA": "workPermitUSA",
    "Date of Birth": "dateOfBirth",
    "Permanent Address": "permanentAddress",
    "Resume File": "resumeFile",
};
const processCSV = async (buffer, resumeFiles) => {
    const summary = {
        total: 0,
        successful: 0,
        failed: 0,
        errors: [],
    };
    const rows = await new Promise((resolve, reject) => {
        const results = [];
        const stream = stream_1.Readable.from(buffer);
        stream
            .pipe((0, csv_parser_1.default)())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
    summary.total = rows.length;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
            const candidateData = {};
            for (const [csvHeader, modelField] of Object.entries(fieldMapping)) {
                let value = row[csvHeader]?.trim();
                if (value) {
                    switch (modelField) {
                        case "phoneNumber":
                            if (!(0, otpService_1.isValidPhoneNumber)(value)) {
                                throw new Error(`Invalid phone number format: ${value}`);
                            }
                            value = (0, otpService_1.formatPhoneNumber)(value);
                            break;
                        case "email":
                            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                                throw new Error(`Invalid email format: ${value}`);
                            }
                            break;
                        case "preferredLocations":
                        case "keySkills":
                            value = value
                                .split(",")
                                .map((item) => item.trim());
                            break;
                        case "dateOfApplication":
                        case "dateOfBirth":
                            value = new Date(value);
                            if (isNaN(value.getTime())) {
                                throw new Error(`Invalid date format for ${csvHeader}: ${row[csvHeader]}`);
                            }
                            break;
                        case "totalExperience":
                        case "annualSalary":
                        case "ugGraduationYear":
                        case "pgGraduationYear":
                        case "doctorateGraduationYear":
                            value = parseFloat(value);
                            if (isNaN(value)) {
                                throw new Error(`Invalid number format for ${csvHeader}: ${row[csvHeader]}`);
                            }
                            break;
                        case "workPermitUSA":
                            value =
                                value.toLowerCase() === "yes" || value.toLowerCase() === "true";
                            break;
                    }
                    candidateData[modelField] = value;
                }
            }
            if (!candidateData.name ||
                !candidateData.email ||
                !candidateData.phoneNumber) {
                throw new Error("Missing required fields: name, email, or phone number");
            }
            const existingCandidate = await Candidate_1.default.findOne({
                $or: [
                    { email: candidateData.email },
                    { phoneNumber: candidateData.phoneNumber },
                ],
            });
            if (existingCandidate) {
                throw new Error(`Candidate already exists with email ${candidateData.email} or phone ${candidateData.phoneNumber}`);
            }
            if (candidateData.resumeFile && resumeFiles && resumeFiles[candidateData.resumeFile]) {
                try {
                    const resumeFile = resumeFiles[candidateData.resumeFile];
                    const resumeUrl = await (0, s3_1.uploadResume)(resumeFile);
                    candidateData.resumeUrl = resumeUrl;
                }
                catch (error) {
                    throw new Error(`Failed to upload resume: ${error.message}`);
                }
            }
            delete candidateData.resumeFile;
            await Candidate_1.default.create(candidateData);
            summary.successful++;
        }
        catch (error) {
            summary.failed++;
            summary.errors.push({
                row: i + 2,
                error: error.message,
            });
        }
    }
    return summary;
};
exports.processCSV = processCSV;
const exportToCSV = async (candidates, trackerFields) => {
    const csvRows = [];
    const headers = trackerFields.map((field) => field.displayName);
    csvRows.push(headers.join(","));
    for (const candidate of candidates) {
        const row = trackerFields.map((field) => {
            let value = candidate[field.candidateField];
            if (Array.isArray(value)) {
                value = value.join("; ");
            }
            else if (value instanceof Date) {
                value = value.toISOString().split("T")[0];
            }
            else if (typeof value === "boolean") {
                value = value ? "Yes" : "No";
            }
            if (typeof value === "string") {
                if (value.includes(",") || value.includes('"')) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
            }
            return value || "";
        });
        csvRows.push(row.join(","));
    }
    return csvRows.join("\n");
};
exports.exportToCSV = exportToCSV;
//# sourceMappingURL=csvService.js.map