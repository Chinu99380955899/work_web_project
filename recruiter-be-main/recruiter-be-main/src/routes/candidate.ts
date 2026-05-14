import express, { Request, Response, NextFunction } from "express";
import { body, query } from "express-validator";
import {
  authenticate,
  AuthenticatedRequest,
  requirePermission,
} from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";
import Candidate from "../models/Candidate";
import { exportToCSV } from "../services/csvService";
import Tracker from "../models/Tracker";
import { getSignedUrl } from "../utils/s3";
import User from "../models/User";

const router = express.Router();

// Create or update candidate profile (for candidates themselves)
router.post(
  "/",
  authenticate,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required"),
    // Add other validations as needed
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const candidateData = {
        ...req.body,
        userId: req.user?._id,
      };

      // Check for existing candidate
      let candidate = await Candidate.findOne({
        userId: req.user?._id,
      });

      if (candidate) {
        // Update existing candidate
        Object.assign(candidate, candidateData);
        await candidate.save();
      } else {
        // Create new candidate
        candidate = await Candidate.create(candidateData);
      }

      res.json({
        success: true,
        message: "Candidate profile saved successfully",
        candidate,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/:id",
  authenticate,
  requirePermission("search"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const candidate = await Candidate.findById(id);
      if (!candidate) {
        throw new ApiError(404, "Candidate not found");
      }

      // Update the candidate with the provided data
      Object.assign(candidate, updateData);
      await candidate.save();

      res.json({
        success: true,
        message: "Candidate updated successfully",
        candidate,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Single candidate upload (for recruiters)
router.post(
  "/upload",
  authenticate,
  requirePermission("single_upload"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required"),
    body("jobTitle").optional().trim(),
    body("currentLocation").optional().trim(),
    body("preferredLocations").optional().isArray(),
    body("totalExperience").optional().isNumeric(),
    body("organization").optional().trim(),
    body("designation").optional().trim(),
    body("startDate").optional().trim(),
    body("endDate").optional().trim(),
    body("currentCompanyName").optional().trim(),
    body("currentCompanyDesignation").optional().trim(),
    body("department").optional().trim(),
    body("role").optional().trim(),
    body("industry").optional().trim(),
    body("keySkills").optional().isArray(),
    body("annualSalary").optional().isNumeric(),
    body("noticePeriod").optional().trim(),
    body("resumeHeadline").optional().trim(),
    body("summary").optional().trim(),

    body("tenthSchool").optional().trim(),
    body("tenthBoard").optional().trim(),
    body("tenthCgpa").optional().trim(),
    body("tenthpassingyear").optional().trim(),
    body("twelfthSchool").optional().trim(),
    body("twelfthBoard").optional().trim(),
    body("twelfthCgpa").optional().trim(),
    body("twelfthpassingyear").optional().trim(),
    body("ugDegree").optional().trim(),
    body("ugSpecialization").optional().trim(),
    body("ugUniversity").optional().trim(),
    body("ugGraduationYear").optional().isNumeric(),
    body("pgDegree").optional().trim(),
    body("pgSpecialization").optional().trim(),
    body("pgUniversity").optional().trim(),
    body("pgGraduationYear").optional().isNumeric(),
    body("doctorateDegree").optional().trim(),
    body("doctorateSpecialization").optional().trim(),
    body("doctorateUniversity").optional().trim(),
    body("doctorateGraduationYear").optional().isNumeric(),
    body("certificationsname").optional().isNumeric(),
    body("certificationID").optional().isNumeric(),
    body("certificationStartDate").optional().isNumeric(),
    body("certificationEndDate").optional().isNumeric(),
    body("gender").optional().trim(),
    body("maritalStatus").optional().trim(),
    body("homeTown").optional().trim(),
    body("pinCode").optional().trim(),
    body("workPermitUSA").optional().isBoolean(),
    body("dateOfBirth").optional().isISO8601(),
    body("permanentAddress").optional().trim(),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const candidateData = {
        ...req.body,
        uploadedBy: req.user?._id,
        dateOfApplication: new Date(),
        lastWorkflowActivity: "Uploaded",
        lastWorkflowActivityBy: req.user?._id,
        timeOfLastWorkflowActivityUpdate: new Date(),
        latestPipelineStage: "New",
        pipelineStatusUpdatedBy: req.user?._id,
        timeWhenStageUpdated: new Date(),
      };

      // Check for existing candidate by email or phone
      const existingCandidate = await Candidate.findOne({
        $or: [
          ...(candidateData.email ? [{ email: candidateData.email }] : []),
          { phoneNumber: candidateData.phoneNumber },
        ],
      });

      if (existingCandidate) {
        throw new ApiError(
          400,
          "Candidate already exists with this email or phone number"
        );
      }

      // Find or create user for this phone number
      let user = await User.findOne({ phoneNumber: candidateData.phoneNumber });
      if (!user) {
        user = await User.create({
          phoneNumber: candidateData.phoneNumber,
          role: "candidate",
          isVerified: true,
          isActive: true,
        });
      }

      // update candidate with user id
      candidateData.userId = user._id;

      // Create new candidate
      const candidate = await Candidate.create(candidateData);

      res.json({
        success: true,
        message: "Candidate uploaded successfully",
        candidate,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get candidate profile
router.get(
  "/me",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const candidate = await Candidate.findOne({
        userId: req.user?._id,
      });

      if (!candidate) {
        throw new ApiError(404, "Candidate profile not found");
      }

      // Generate signed URL for resume if it exists
      let candidateWithSignedUrl = candidate.toObject();
      if (candidate.resumeUrl) {
        try {
          candidateWithSignedUrl.resumeUrl = await getSignedUrl(
            candidate.resumeUrl,
            3600
          ); // 1 hour expiry
        } catch (error) {
          console.error("Failed to generate signed URL for resume:", error);
          candidateWithSignedUrl.resumeUrl = undefined;
        }
      }

      res.json({
        success: true,
        candidate: candidateWithSignedUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Search candidates (for recruiters)
router.get(
  "/search",
  authenticate,
  requirePermission("search"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const {
        location,
        role,
        skills,
        experience,
        salary,
        page = 1,
        limit = 10,
      } = req.query;

      const query: any = { isActive: true };

      // Build search query
      if (location) {
        query.$or = [
          { currentLocation: { $regex: location, $options: "i" } },
          { preferredLocations: { $regex: location, $options: "i" } },
        ];
      }

      if (role) {
        query.role = { $regex: role, $options: "i" };
      }

      if (skills) {
        // Handle skills as either array or comma-separated string
        const skillsArray = Array.isArray(skills)
          ? skills
          : (skills as string).split(",");

        query.keySkills = {
          $in: skillsArray
            .filter(
              (skill): skill is string =>
                typeof skill === "string" && skill.trim().length > 0
            )
            .map((skill) => new RegExp(skill.trim(), "i")),
        };
      }

      if (experience) {
        const [min, max] = (experience as string).split("-").map(Number);
        query.totalExperience = { $gte: min, $lte: max };
      }

      if (salary) {
        const [min, max] = (salary as string).split("-").map(Number);
        query.annualSalary = { $gte: min, $lte: max };
      }

      // Execute search with pagination
      const skip = (Number(page) - 1) * Number(limit);

      const candidates = await Candidate.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ dateOfApplication: -1 });

      const total = await Candidate.countDocuments(query);

      // Generate signed URLs for resumes and excel files
      const candidatesWithSignedUrls = await Promise.all(
        candidates.map(async (candidate) => {
          const candidateObj = candidate.toObject();
          if (candidateObj.resumeUrl) {
            try {
              candidateObj.resumeUrl = await getSignedUrl(
                candidateObj.resumeUrl,
                3600
              );
            } catch (error) {
              console.error("Failed to generate signed URL for resume:", error);
              candidateObj.resumeUrl = undefined;
            }
          }
          if (candidateObj.excelFileUrl) {
            try {
              candidateObj.excelFileUrl = await getSignedUrl(
                candidateObj.excelFileUrl,
                3600
              );
            } catch (error) {
              console.error("Failed to generate signed URL for Excel file:", error);
              candidateObj.excelFileUrl = undefined;
            }
          }
          return candidateObj;
        })
      );

      res.json({
        success: true,
        candidates: candidatesWithSignedUrls,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Export candidates based on tracker format
router.post(
  "/export",
  authenticate,
  requirePermission("export"),
  [
    body("trackerId").notEmpty().withMessage("Tracker ID is required"),
    body("candidateIds")
      .isArray()
      .withMessage("Candidate IDs must be an array"),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { trackerId, candidateIds } = req.body;

      // Get tracker format
      const tracker = await Tracker.findById(trackerId);
      if (!tracker) {
        throw new ApiError(404, "Tracker not found");
      }

      // Get candidates
      const candidates = await Candidate.find({
        _id: { $in: candidateIds },
      });

      // Generate CSV
      const csv = await exportToCSV(candidates, tracker.fields);

      // Update tracker usage
      tracker.usageCount += 1;
      tracker.lastUsed = new Date();
      await tracker.save();

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=candidates-${Date.now()}.csv`
      );
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
);

// Update candidate workflow status
router.patch(
  "/:id/workflow",
  authenticate,
  requirePermission("search"),
  [
    body("stage").notEmpty().withMessage("Pipeline stage is required"),
    body("comment").optional().trim(),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { stage, comment } = req.body;

      const candidate = await Candidate.findById(id);
      if (!candidate) {
        throw new ApiError(404, "Candidate not found");
      }

      // Update workflow information
      candidate.lastWorkflowActivity = "Stage Update";
      candidate.lastWorkflowActivityBy = req.user?._id;
      candidate.timeOfLastWorkflowActivityUpdate = new Date();
      candidate.latestPipelineStage = stage;
      candidate.pipelineStatusUpdatedBy = req.user?._id;
      candidate.timeWhenStageUpdated = new Date();

      // Add comment if provided
      if (comment) {
        candidate.comments.push({
          text: comment,
          commentBy: req.user?._id,
          timePosted: new Date(),
        });
      }

      await candidate.save();

      res.json({
        success: true,
        message: "Workflow status updated successfully",
        candidate,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Get candidate profile by ID (for recruiters)
// ✅ Get candidate profile by ID (for recruiters)
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    let candidate = await Candidate.findById(id);

    // If not found by Mongo _id, try userId
    if (!candidate) {
      candidate = await Candidate.findOne({ userId: id });
    }

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const candidateObj = candidate.toObject();

    if (candidateObj.resumeUrl) {
      try {
        console.log("🟢 Generating signed resume URL for:", candidateObj.resumeUrl);
        const signedUrl = await getSignedUrl(candidateObj.resumeUrl, 3600);
        candidateObj.resumeUrl = signedUrl;
      } catch (err) {
        console.error("❌ Failed to sign resume URL:", err);
      }
    }

    if (candidateObj.excelFileUrl) {
      try {
        const signedExcelUrl = await getSignedUrl(candidateObj.excelFileUrl, 3600);
        candidateObj.excelFileUrl = signedExcelUrl;
      } catch (err) {
        console.error("❌ Failed to sign Excel URL:", err);
      }
    }

    res.status(200).json({
      success: true,
      candidate: candidateObj,
    });
  } catch (error) {
    next(error);
  }
});


export default router;
