import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  authenticate,
  AuthenticatedRequest,
  requirePermission,
} from "../middleware/auth";
import { ApiError } from "../middleware/errorHandler";
import Tracker from "../models/Tracker";

const router = express.Router();

// Create new tracker
router.post(
  "/",
  authenticate,
  requirePermission("manage_trackers"),
  [
    body("name").trim().notEmpty().withMessage("Tracker name is required"),
    body("fields").isArray().withMessage("Fields must be an array"),
    body("fields.*.candidateField")
      .notEmpty()
      .withMessage("Candidate field is required"),
    body("fields.*.displayName")
      .notEmpty()
      .withMessage("Display name is required"),
    body("fields.*.order").isNumeric().withMessage("Order must be a number"),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { name, description, companyName, fields, isDefault } = req.body;

      // Create tracker
      const tracker = await Tracker.create({
        name,
        description,
        companyName,
        fields: fields.map((field: any, index: number) => ({
          ...field,
          order: field.order || index + 1,
        })),
        isDefault: isDefault || false,
        createdBy: req.user?._id,
      });

      res.json({
        success: true,
        message: "Tracker created successfully",
        tracker,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all trackers for current user
router.get(
  "/",
  authenticate,
  requirePermission("export"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const trackers = await Tracker.find({
        $or: [{ createdBy: req.user?._id }, { isDefault: true }],
        isActive: true,
      }).sort({ usageCount: -1 });

      res.json({
        success: true,
        trackers,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get tracker by ID
router.get(
  "/:id",
  authenticate,
  requirePermission("export"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tracker = await Tracker.findOne({
        _id: req.params.id,
        $or: [{ createdBy: req.user?._id }, { isDefault: true }],
        isActive: true,
      });

      if (!tracker) {
        throw new ApiError(404, "Tracker not found");
      }

      res.json({
        success: true,
        tracker,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update tracker
router.patch(
  "/:id",
  authenticate,
  requirePermission("manage_trackers"),
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Tracker name cannot be empty"),
    body("fields").optional().isArray().withMessage("Fields must be an array"),
    body("fields.*.candidateField")
      .optional()
      .notEmpty()
      .withMessage("Candidate field is required"),
    body("fields.*.displayName")
      .optional()
      .notEmpty()
      .withMessage("Display name is required"),
    body("fields.*.order")
      .optional()
      .isNumeric()
      .withMessage("Order must be a number"),
  ],
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tracker = await Tracker.findOne({
        _id: req.params.id,
        createdBy: req.user?._id,
        isActive: true,
      });

      if (!tracker) {
        throw new ApiError(404, "Tracker not found");
      }

      // Update fields
      const { name, description, companyName, fields, isDefault } = req.body;

      if (name) tracker.name = name;
      if (description !== undefined) tracker.description = description;
      if (companyName !== undefined) tracker.companyName = companyName;
      if (fields) {
        tracker.fields = fields.map((field: any, index: number) => ({
          ...field,
          order: field.order || index + 1,
        }));
      }
      if (isDefault !== undefined) tracker.isDefault = isDefault;

      await tracker.save();

      res.json({
        success: true,
        message: "Tracker updated successfully",
        tracker,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete tracker
router.delete(
  "/:id",
  authenticate,
  requirePermission("manage_trackers"),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tracker = await Tracker.findOne({
        _id: req.params.id,
        createdBy: req.user?._id,
      });

      if (!tracker) {
        throw new ApiError(404, "Tracker not found");
      }

      // Soft delete
      tracker.isActive = false;
      await tracker.save();

      res.json({
        success: true,
        message: "Tracker deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
