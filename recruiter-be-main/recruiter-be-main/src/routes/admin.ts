import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  authenticate,
  AuthenticatedRequest,
  adminOnly,
} from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";
import User from "../models/User";
import { formatPhoneNumber, isValidPhoneNumber } from "../services/otpService";
import jwt from "jsonwebtoken";

const router = express.Router();

// Create recruiter account
router.post(
  "/recruiters",
  authenticate,
  adminOnly,
  [
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .custom((value) => {
        if (!isValidPhoneNumber(value)) {
          throw new Error("Invalid phone number format");
        }
        return true;
      }),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("permissions")
      .isArray()
      .withMessage("Permissions must be an array")
      .custom((value) => {
        const validPermissions = [
          "bulk_upload",
          "single_upload",
          "export",
          "search",
          "manage_recruiters",
          "manage_trackers",
          'funnel_data',
          'sales_funnel_data',
          'job_post',

        ];
        return value.every((permission: string) =>
          validPermissions.includes(permission)
        );
      })
      .withMessage("Invalid permissions"),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, email, permissions } = req.body;
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ phoneNumber: formattedPhoneNumber }, { email }],
      });

      if (existingUser) {
        throw new ApiError(
          400,
          "User already exists with this phone number or email"
        );
      }

      // Create recruiter account
      const recruiter = await User.create({
        phoneNumber: formattedPhoneNumber,
        email,
        role: "recruiter",
        permissions,
        isVerified: true, // Admin-created accounts are pre-verified
        createdBy: req.user?._id,
      });

      res.json({
        success: true,
        message: "Recruiter account created successfully",
        recruiter,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all recruiters
router.get(
  "/recruiters",
  authenticate,
  adminOnly,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const recruiters = await User.find({
        role: "recruiter",
        isActive: true,
      }).select("-__v");

      res.json({
        success: true,
        recruiters,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update recruiter permissions
router.patch(
  "/recruiters/:id",
  authenticate,
  adminOnly,
  [
    body("permissions")
      .isArray()
      .withMessage("Permissions must be an array")
      .custom((value) => {
        const validPermissions = [
          "bulk_upload",
          "single_upload",
          "export",
          "search",
          "manage_recruiters",
          "manage_trackers",
          "funnel_data",
          "sales_funnel_data",
          "job_post"
        ];
        return value.every((permission: string) =>
          validPermissions.includes(permission)
        );
      })
      .withMessage("Invalid permissions"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { permissions, isActive } = req.body;

      const recruiter = await User.findOne({
        _id: id,
        role: "recruiter",
      });

      if (!recruiter) {
        throw new ApiError(404, "Recruiter not found");
      }

      // Update permissions
      if (permissions) {
        recruiter.permissions = permissions;
      }

      // Update active status
      if (typeof isActive === "boolean") {
        recruiter.isActive = isActive;
      }

      await recruiter.save();

      res.json({
        success: true,
        message: "Recruiter updated successfully",
        recruiter,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete recruiter (soft delete)
router.delete(
  "/recruiters/:id",
  authenticate,
  adminOnly,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const recruiter = await User.findOne({
        _id: id,
        role: "recruiter",
      });

      if (!recruiter) {
        throw new ApiError(404, "Recruiter not found");
      }

      // Soft delete
      recruiter.isActive = false;
      await recruiter.save();

      res.json({
        success: true,
        message: "Recruiter deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get system statistics
router.get(
  "/stats",
  authenticate,
  adminOnly,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const stats = {
        users: {
          total: await User.countDocuments(),
          candidates: await User.countDocuments({ role: "candidate" }),
          recruiters: await User.countDocuments({
            role: "recruiter",
            isActive: true,
          }),
          admins: await User.countDocuments({ role: "admin" }),
        },
        activity: {
          activeUsers: await User.countDocuments({
            lastLogin: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            }, // Last 30 days
          }),
          verifiedUsers: await User.countDocuments({ isVerified: true }),
        },
      };

      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
