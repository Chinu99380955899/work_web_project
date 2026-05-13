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
declare const _default: mongoose.Model<ISalesFunnel, {}, {}, {}, mongoose.Document<unknown, {}, ISalesFunnel, {}, mongoose.DefaultSchemaOptions> & ISalesFunnel & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISalesFunnel>;
export default _default;
//# sourceMappingURL=Salesfunnel.d.ts.map