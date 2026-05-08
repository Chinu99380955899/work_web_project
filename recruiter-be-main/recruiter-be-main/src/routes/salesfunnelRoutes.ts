import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { ApiError } from "../middleware/errorHandler";
import SalesFunnel from "../models/Salesfunnel";

const router = express.Router();

/**
 * @route   POST /api/sales-funnel

 */
router.post(
  "/",
  [
    body("dateOfFunnelGeneration").notEmpty().withMessage("Date of Funnel Generation is required"),
    body("accountManager").notEmpty().withMessage("Account Manager is required"),
    body("lead").optional().trim(),
    body("customerName").optional().trim(),
    body("projectName").optional().trim(),
    body("location").optional().trim(),
    body("opportunityType").optional().trim(),
    body("opportunityDescription").optional().trim(),
    body("approximateValue").optional().isNumeric(),
    body("status").optional().trim(),
    body("expectedClosureMonth").optional().trim(),
    body("projectedRevenue").optional().isNumeric(),
    body("createdBy").notEmpty().withMessage("CreatedBy (User ID) is required"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const funnel = await SalesFunnel.create(req.body);
      res.status(201).json({
        success: true,
        message: "Sales funnel created successfully",
        data: funnel,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/sales-funnel

 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const funnels = await SalesFunnel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: funnels.length,
      data: funnels,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/sales-funnel/:id

 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const funnel = await SalesFunnel.findById(req.params.id);
    if (!funnel) throw new ApiError(404, "Sales Funnel not found");

    res.json({
      success: true,
      data: funnel,
    });
  } catch (error) {
    next(error);
  }
});

/**
 *  @route   GET /api/sales-funnel/my-funnels/:userId
*/
router.get("/my-salesfunnels/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const mysalesFunnels = await SalesFunnel.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: mysalesFunnels.length,
      data: mysalesFunnels,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user sales funnels", error });
  }
});

/**
 * @route   PATCH /api/sales-funnel/:id

 */
router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const funnel = await SalesFunnel.findById(req.params.id);
    if (!funnel) throw new ApiError(404, "Sales Funnel not found");

    Object.assign(funnel, req.body);
    await funnel.save();

    res.json({
      success: true,
      message: "Sales funnel updated successfully",
      data: funnel,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/sales-funnel/:id

 */
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const funnel = await SalesFunnel.findByIdAndDelete(req.params.id);
    if (!funnel) throw new ApiError(404, "Sales Funnel not found");

    res.json({
      success: true,
      message: "Sales funnel deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
