import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

const userSchema = new Schema<IUser>({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'],
    default: 'candidate',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  permissions: [{
    type: String,
    enum: ['bulk_upload', 'single_upload', 'export', 'search', 'manage_recruiters', 'manage_trackers', 'funnel_data', 'sales_funnel_data', 'job_post']
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  lastLogin: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ phoneNumber: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Instance method to compare password (for future use if needed)
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Ensure email is unique only when provided
userSchema.index(
  { email: 1 },
  { 
    unique: true, 
    partialFilterExpression: { email: { $exists: true, $ne: null } } 
  }
);

export default mongoose.model<IUser>('User', userSchema); 