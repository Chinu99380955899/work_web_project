import mongoose, { Schema, Document } from "mongoose";

export interface FunnelFormData extends Document {
  dateOfReceipt: string;
  customerName: string;
  projectName: string;
  taSpoc: string;
  referenceNo: string;
  skill: string;
  countRequired: number;
  opportunityType: string;
  expRequired: string;
  location: string;
  noticePeriod: string;
  budget: string;
  ageing: string;
  accountManager: string;
  accountdirector: string;
  recruiterName: string;
  cvsShared: number;
  status: string;
  createdBy: string;
}

const  FunnelSchema: Schema = new Schema(
  {
    dateOfReceipt: { type: String, required: true },
    customerName: { type: String, required: true },
    projectName: { type: String, required: true },
    taSpoc: { type: String, required: true },
    referenceNo: { type: String },
    skill: { type: String, required: true },
    countRequired: { type: Number, default: 0 },
    opportunityType: { type: String, enum: ["FTE", "T&M"], required: true },
    expRequired: { type: String },
    location: { type: String },
    noticePeriod: { type: String },
    budget: { type: String },
    ageing: { type: String },
    accountManager: { type: String },
    accountdirector: { type: String },
    recruiterName: { type: String },
    cvsShared: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "Need to Source Profiles",
        "In Test Stage",
        "L1 Round",
        "L2 Round",
        "C1 Round",
        "C2 Round",
        "C3 Round",
        "HR Round",
        "FTF Round",
        "Lost",
        "Deployed",
        "On Hold",
      ],
    },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<FunnelFormData>(
  "Funnel",
  FunnelSchema
);
