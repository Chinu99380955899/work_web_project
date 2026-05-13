import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: NativeDate;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default _default;
//# sourceMappingURL=JobApplication.d.ts.map