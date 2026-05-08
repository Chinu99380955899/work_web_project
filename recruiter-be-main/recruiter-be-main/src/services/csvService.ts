import csv from "csv-parser";
import { Readable } from "stream";
import { ApiError } from "../middleware/errorHandler";
import Candidate from "../models/Candidate";
import { formatPhoneNumber, isValidPhoneNumber } from "./otpService";
import { uploadResume } from "../utils/s3";

interface CSVRow {
  [key: string]: string;
}

interface ProcessSummary {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// Map CSV headers to model fields
const fieldMapping: { [key: string]: string } = {
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

// Process CSV data and create candidates
export const processCSV = async (
  buffer: Buffer,
  resumeFiles?: { [key: string]: Express.Multer.File }
): Promise<ProcessSummary> => {
  const summary: ProcessSummary = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: [],
  };

  const rows: CSVRow[] = await new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });

  summary.total = rows.length;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      // Transform CSV data to model fields
      const candidateData: any = {};

      for (const [csvHeader, modelField] of Object.entries(fieldMapping)) {
        let value: any = row[csvHeader]?.trim();

        if (value) {
          switch (modelField) {
            case "phoneNumber":
              if (!isValidPhoneNumber(value)) {
                throw new Error(`Invalid phone number format: ${value}`);
              }
              value = formatPhoneNumber(value);
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
                .map((item: string) => item.trim()) as any;
              break;

            case "dateOfApplication":
            case "dateOfBirth":
              value = new Date(value);
              if (isNaN(value.getTime())) {
                throw new Error(
                  `Invalid date format for ${csvHeader}: ${row[csvHeader]}`
                );
              }
              break;

            case "totalExperience":
            case "annualSalary":
            case "ugGraduationYear":
            case "pgGraduationYear":
            case "doctorateGraduationYear":
              value = parseFloat(value);
              if (isNaN(value)) {
                throw new Error(
                  `Invalid number format for ${csvHeader}: ${row[csvHeader]}`
                );
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

      // Check for required fields
      if (
        !candidateData.name ||
        !candidateData.email ||
        !candidateData.phoneNumber
      ) {
        throw new Error(
          "Missing required fields: name, email, or phone number"
        );
      }

      // Check if candidate already exists
      const existingCandidate = await Candidate.findOne({
        $or: [
          { email: candidateData.email },
          { phoneNumber: candidateData.phoneNumber },
        ],
      });

      if (existingCandidate) {
        throw new Error(
          `Candidate already exists with email ${candidateData.email} or phone ${candidateData.phoneNumber}`
        );
      }

      // Handle resume file upload if provided
      if (candidateData.resumeFile && resumeFiles && resumeFiles[candidateData.resumeFile]) {
        try {
          const resumeFile = resumeFiles[candidateData.resumeFile];
          const resumeUrl = await uploadResume(resumeFile);
          candidateData.resumeUrl = resumeUrl;
        } catch (error: any) {
          throw new Error(`Failed to upload resume: ${error.message}`);
        }
      }

      // Remove resumeFile field as it's not part of the model
      delete candidateData.resumeFile;

      // Create new candidate
      await Candidate.create(candidateData);
      summary.successful++;
    } catch (error: any) {
      summary.failed++;
      summary.errors.push({
        row: i + 2, // Add 2 to account for 0-based index and header row
        error: error.message,
      });
    }
  }

  return summary;
};

// Export candidates to CSV based on tracker format
export const exportToCSV = async (
  candidates: any[],
  trackerFields: any[]
): Promise<string> => {
  const csvRows: string[] = [];

  // Add header row
  const headers = trackerFields.map((field) => field.displayName);
  csvRows.push(headers.join(","));

  // Add data rows
  for (const candidate of candidates) {
    const row = trackerFields.map((field) => {
      let value = candidate[field.candidateField];

      // Format value based on field type
      if (Array.isArray(value)) {
        value = value.join("; ");
      } else if (value instanceof Date) {
        value = value.toISOString().split("T")[0];
      } else if (typeof value === "boolean") {
        value = value ? "Yes" : "No";
      }

      // Escape commas and quotes
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
