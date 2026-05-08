// import { Schema, model, Document } from "mongoose";

// export interface IJob extends Document {
//   companyName: string;
//   jobTitle: string;
//   jobDescription?: string;
//   skills: string[];
//   location?: string;
//   minExp?: number;
//   maxExp?: number;
//   minSalary?: number;
//   maxSalary?: number;
//   createdBy: string;
//   createdAt: Date;

// }

// const JobSchema = new Schema<IJob>(
//   {
//     companyName: { type: String, required: true },
//     jobTitle: { type: String, required: true },
//     jobDescription: { type: String },
//     skills: { type: [String], default: [] },
//     location: { type: String },
//     minExp: { type: Number },
//     maxExp: { type: Number },
//     minSalary: { type: Number },
//     maxSalary: { type: Number },
//     createdBy: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
//   },
//   { timestamps: true }
// );

// export default model<IJob>("Job", JobSchema);

import mongoose, { Schema, model, Document } from "mongoose";

export interface IJob extends Document {
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  skills: string[];
  location?: string;
  minExp?: number;
  maxExp?: number;
  minSalary?: number;
  maxSalary?: number;
  createdBy: string;
  createdAt: Date;
  applicants: {
    userId: mongoose.Schema.Types.ObjectId;
    appliedAt: Date;
  }[];
}

const JobSchema = new Schema<IJob>(
  {
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String },
    skills: { type: [String], default: [] },
    location: { type: String },
    minExp: { type: Number },
    maxExp: { type: Number },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    applicants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default model<IJob>("Job", JobSchema);
