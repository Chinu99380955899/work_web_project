import mongoose, { Document, Schema } from 'mongoose';

export interface ITrackerField {
  candidateField: string; // Field from candidate model
  displayName: string; // Custom display name for the column
  order: number; // Order in the CSV
  isRequired: boolean; // Whether this field must be included
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

const trackerFieldSchema = new Schema<ITrackerField>({
  candidateField: {
    type: String,
    required: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
});

const trackerSchema = new Schema<ITracker>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  fields: [trackerFieldSchema],
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  lastUsed: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
trackerSchema.index({ createdBy: 1 });
trackerSchema.index({ name: 1 });
trackerSchema.index({ isDefault: 1 });
trackerSchema.index({ isActive: 1 });
trackerSchema.index({ usageCount: -1 });

// Ensure only one default tracker per user
trackerSchema.index(
  { createdBy: 1, isDefault: 1 },
  { 
    unique: true, 
    partialFilterExpression: { isDefault: true } 
  }
);

export default mongoose.model<ITracker>('Tracker', trackerSchema); 