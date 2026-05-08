import { Router, Request, Response } from "express";
import Funnel from "../models/Funnel";

const router = Router();


router.post("/", async (req: Request, res: Response) => {
  try {
    
    const funnel = new Funnel({
      ...req.body,
      createdBy: req.body.createdBy, // ✅ important
    });

    const savedData = await funnel.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ message: "Error saving requirement", error });
  }
});

// ✅ Get ALL funnel data (with optional filters)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { customer, project, skill, location, recruiter } = req.query;

    let filter: any = {};

    if (customer) {
      filter.customerName = { $regex: customer as string, $options: "i" };
    }
    if (project) {
      filter.projectName = { $regex: project as string, $options: "i" };
    }
    if (skill) {
      filter.skill = { $regex: skill as string, $options: "i" };
    }
    if (location) {
      filter.location = { $regex: location as string, $options: "i" };
    }
    if (recruiter) {
      filter.recruiterName = { $regex: recruiter as string, $options: "i" };
    }

    const data = await Funnel.find(filter);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requirements", error });
  }
});

// ✅ Get ONLY Logged-in User Funnel Data
router.get("/my-funnels/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const myFunnels = await Funnel.find({ createdBy: userId });
    res.json(myFunnels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requirements", error });
  }
});

export default router;
