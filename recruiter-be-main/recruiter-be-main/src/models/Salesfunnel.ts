import mongoose, { Document, Schema } from "mongoose";

export interface ISalesFunnel extends Document {
  dateOfFunnelGeneration: string;
  accountManager: string;
  lead: string;
  customerName: string;
  projectName: string;
  location: string;
  opportunityType: string;
  opportunityDescription: string;
  approximateValue: number;
  status: string;
  expectedClosureMonth: string;
  projectedRevenue: number;
  createdBy: string;
}

const SalesFunnelSchema: Schema = new Schema(
  {
    dateOfFunnelGeneration: { type: String, required: true },
    accountManager: { type: String, required: true },
    lead: { type: String },
    customerName: { type: String },
    projectName: { type: String },
    location: { type: String },
    opportunityType: { type: String },
    opportunityDescription: { type: String },
    approximateValue: { type: Number },
    status: { type: String },
    expectedClosureMonth: { type: String },
    projectedRevenue: { type: Number },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISalesFunnel>("SalesFunnel", SalesFunnelSchema);
