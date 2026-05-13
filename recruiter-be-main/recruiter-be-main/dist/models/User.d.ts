import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    phoneNumber: string;
    email?: string;
    role: 'candidate' | 'recruiter' | 'admin';
    isVerified: boolean;
    permissions?: string[];
    createdBy?: mongoose.Types.ObjectId;
    lastLogin?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map