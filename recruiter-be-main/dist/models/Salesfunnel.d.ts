import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<ISalesFunnel, {}, {}, {}, mongoose.Document<unknown, {}, ISalesFunnel> & ISalesFunnel & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Salesfunnel.d.ts.map