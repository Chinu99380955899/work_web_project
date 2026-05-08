import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<FunnelFormData, {}, {}, {}, mongoose.Document<unknown, {}, FunnelFormData> & FunnelFormData & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Funnel.d.ts.map