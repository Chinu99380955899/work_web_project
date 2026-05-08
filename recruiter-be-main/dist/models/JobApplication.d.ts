import mongoose from "mongoose";
declare const _default: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: Date;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: Date;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: Date;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: Date;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: Date;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    status: "Applied" | "Shortlisted" | "Rejected" | "Hired";
    appliedAt: Date;
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default _default;
//# sourceMappingURL=JobApplication.d.ts.map