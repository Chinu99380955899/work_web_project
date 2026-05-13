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
declare const _default: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, mongoose.DefaultSchemaOptions> & IJob & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJob>;
export default _default;
//# sourceMappingURL=Job.d.ts.map