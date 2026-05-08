"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Funnel_1 = __importDefault(require("../models/Funnel"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const funnel = new Funnel_1.default({
            ...req.body,
            createdBy: req.body.createdBy,
        });
        const savedData = await funnel.save();
        res.status(201).json(savedData);
    }
    catch (error) {
        res.status(500).json({ message: "Error saving requirement", error });
    }
});
router.get("/", async (req, res) => {
    try {
        const { customer, project, skill, location, recruiter } = req.query;
        let filter = {};
        if (customer) {
            filter.customerName = { $regex: customer, $options: "i" };
        }
        if (project) {
            filter.projectName = { $regex: project, $options: "i" };
        }
        if (skill) {
            filter.skill = { $regex: skill, $options: "i" };
        }
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }
        if (recruiter) {
            filter.recruiterName = { $regex: recruiter, $options: "i" };
        }
        const data = await Funnel_1.default.find(filter);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching requirements", error });
    }
});
router.get("/my-funnels/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const myFunnels = await Funnel_1.default.find({ createdBy: userId });
        res.json(myFunnels);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user requirements", error });
    }
});
exports.default = router;
//# sourceMappingURL=funnel.js.map