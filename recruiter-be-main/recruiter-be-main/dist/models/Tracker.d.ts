import mongoose, { Document } from 'mongoose';
export interface ITrackerField {
    candidateField: string;
    displayName: string;
    order: number;
    isRequired: boolean;
}
export interface ITracker extends Document {
    name: string;
    description?: string;
    createdBy: mongoose.Types.ObjectId;
    companyName?: string;
    fields: ITrackerField[];
    isDefault: boolean;
    isActive: boolean;
    usageCount: number;
    lastUsed?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITracker, {}, {}, {}, mongoose.Document<unknown, {}, ITracker, {}, mongoose.DefaultSchemaOptions> & ITracker & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITracker>;
export default _default;
//# sourceMappingURL=Tracker.d.ts.map