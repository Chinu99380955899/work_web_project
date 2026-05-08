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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map