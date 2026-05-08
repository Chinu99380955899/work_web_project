import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob> & IJob & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Job.d.ts.map