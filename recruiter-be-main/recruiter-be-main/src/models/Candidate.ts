import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  // Basic Information
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  dateOfApplication: Date;
  name: string;
  email: string;
  phoneNumber: string;
  pan?: string;
  currentLocation?: string;
  preferredLocations?: string[];
  totalExperience?: number;

  //  Previous company name
  organization?: string;
  designation?: string;
  startDate?: Date;
  endDate?: Date;


  // Current Job Information 
  currentCompanyName?: string;
  currentCompanyDesignation?: string;
  department?: string;
  role?: string;
  industry?: string;
  keySkills?: string[];
  annualSalary?: number;
  noticePeriod?: string;

  experience?: Array<{
    companyName: string;
    companyDesignation: string;
    department?:string;
    role?:string;
    industry?:string;
    keySkills?:string[];
    annualSalary?:number;
    noticePeriod?:string;
    resumeHeadline?:string;
    summary?:string;
    workStart: Date;
    workEnd: Date;
  }>;
  
  // Profile Information
  resumeHeadline?: string;
  summary?: string;

  // Education - tenth
  tenthSchool?: string;
  tenthBoard?: string;
  tenthCgpa?: string;
  tenthpassingyear?: string;

  // Education - twelfth
  twelfthSchool?: string;
  twelfthBoard?: string;
  twelfthCgpa?: string;
  twelfthpassingyear?: string;


  // Education - Under Graduation
  ugDegree?: string;
  ugSpecialization?: string;
  ugUniversity?: string;
  ugGraduationYear?: number;


  // Education - Post Graduation
  pgDegree?: string;
  pgSpecialization?: string;
  pgUniversity?: string;
  pgGraduationYear?: number;

  // Education - Doctorate
  doctorateeDegree?: string;
  doctorateSpecialization?: string;
  doctorateUniversity?: string;
  doctorateGraduationYear?: number;

  // certificationsname
  certificationsname?: string;
  certificationID?: string;
  certificationStartDate?: Date;
  certificationEndDate?: Date;
  // Personal Information
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
  homeTown?: string;
  pinCode?: string;
  workPermitUSA?: boolean;
  dateOfBirth?: Date;
  permanentAddress?: string;

  // Workflow Information
  lastWorkflowActivity?: string;
  lastWorkflowActivityBy?: mongoose.Types.ObjectId;
  timeOfLastWorkflowActivityUpdate?: Date;
  latestPipelineStage?: string;
  pipelineStatusUpdatedBy?: mongoose.Types.ObjectId;
  timeWhenStageUpdated?: Date;

  // Document Management
  resumeUrl?: string;
  downloaded?: boolean;
  downloadedBy?: mongoose.Types.ObjectId[];
  timeOfDownload?: Date[];
  viewed?: boolean;
  viewedBy?: mongoose.Types.ObjectId[];
  timeOfView?: Date[];
  emailed?: boolean;
  emailedBy?: mongoose.Types.ObjectId[];
  timeOfEmail?: Date[];

  // Communication
  callingStatus?: 'Not Called' | 'Called' | 'Interested' | 'Not Interested' | 'Callback Required';
  callingStatusUpdatedBy?: mongoose.Types.ObjectId;
  timeOfCallingActivityUpdate?: Date;

  // Comments
  comments: Array<{
    text: string;
    commentBy: mongoose.Types.ObjectId;
    timePosted: Date;
  }>;

  // Source and metadata
  source?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const candidateSchema = new Schema<ICandidate>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfApplication: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  pan: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'],
  },
  currentLocation: {
    type: String,
    trim: true,
  },
  preferredLocations: [{
    type: String,
    trim: true,
  }],
  totalExperience: {
    type: Number,
    min: 0,
  },

  organization: {
    type: String,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
  },

  endDate: {
    type: Date,
  },
  // Current Job Information
  currentCompanyName: {
    type: String,
    trim: true,
  },
  currentCompanyDesignation: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  keySkills: [{
    type: String,
    trim: true,
  }],
  annualSalary: {
    type: Number,
    min: 0,
  },
  noticePeriod: {
    type: String,
    trim: true,
  },
  // Profile Information
  resumeHeadline: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },

  experience:{
    type: Array,
    default: [],
  },
  
  // Education - Under Graduation
  tenthSchool: {
    type: String,
    trim: true
  },

  tenthBoard: {
    type: String,
    trim: true
  },
  tenthCgpa: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },
  tenthpassingyear: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },

  // Education - Under twelfth
  twelfthSchool: {
    type: String,
    trim: true
  },
  twelfthBoard: {
    type: String,
    trim: true
  },
  twelfthCgpa: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },
  twelfthpassingyear: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },

  ugDegree: {
    type: String,
    trim: true,
  },
  ugSpecialization: {
    type: String,
    trim: true,
  },
  ugUniversity: {
    type: String,
    trim: true,
  },
  ugGraduationYear: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },

  // Education - Post Graduation
  pgDegree: {
    type: String,
    trim: true,
  },
  pgSpecialization: {
    type: String,
    trim: true,
  },
  pgUniversity: {
    type: String,
    trim: true,
  },
  pgGraduationYear: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },

  // Education - Doctorate
  doctorateeDegree: {
    type: String,
    trim: true,
  },
  doctorateSpecialization: {
    type: String,
    trim: true,
  },
  doctorateUniversity: {
    type: String,
    trim: true,
  },
  doctorateGraduationYear: {
    type: Number,
    max: new Date().getFullYear() + 5,
  },
  certificationsname: {
    type: String,
    trim: true,
  },
  certificationID: {
    type: String,
    trim: true,
  },
  certificationStartDate: {
    type: Date,
  },
  certificationEndDate: {
    type: Date,

  },

  // Personal Information
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other'],
  },
  homeTown: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    trim: true,
    match: [/^[1-9][0-9]{5}$/, 'Please enter a valid PIN code'],
  },
  workPermitUSA: {
    type: Boolean,
    default: false,
  },
  dateOfBirth: {
    type: Date,
  },
  permanentAddress: {
    type: String,
    trim: true,
  },

  // Workflow Information
  lastWorkflowActivity: {
    type: String,
    trim: true,
  },
  lastWorkflowActivityBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timeOfLastWorkflowActivityUpdate: {
    type: Date,
  },
  latestPipelineStage: {
    type: String,
    trim: true,
    default: 'New Application',
  },
  pipelineStatusUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timeWhenStageUpdated: {
    type: Date,
    default: Date.now,
  },

  // Document Management
  resumeUrl: {
    type: String,
    trim: true,
  },
  downloaded: {
    type: Boolean,
    default: false,
  },
  downloadedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  timeOfDownload: [{
    type: Date,
  }],
  viewed: {
    type: Boolean,
    default: false,
  },
  viewedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  timeOfView: [{
    type: Date,
  }],
  emailed: {
    type: Boolean,
    default: false,
  },
  emailedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  timeOfEmail: [{
    type: Date,
  }],

  // Communication
  callingStatus: {
    type: String,
    enum: ['Not Called', 'Called', 'Interested', 'Not Interested', 'Callback Required'],
    default: 'Not Called',
  },
  callingStatusUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timeOfCallingActivityUpdate: {
    type: Date,
  },

  // Comments
  comments: [{
    text: {
      type: String,
      required: true,
      trim: true,
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timePosted: {
      type: Date,
      default: Date.now,
    },
  }],

  // Source and metadata
  source: {
    type: String,
    trim: true,
    default: 'Direct Application',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better search performance
candidateSchema.index({ email: 1 });
candidateSchema.index({ phoneNumber: 1 });
candidateSchema.index({ name: 'text', resumeHeadline: 'text', summary: 'text' });
candidateSchema.index({ currentLocation: 1 });
candidateSchema.index({ preferredLocations: 1 });
candidateSchema.index({ keySkills: 1 });
candidateSchema.index({ role: 1 });
candidateSchema.index({ industry: 1 });
candidateSchema.index({ totalExperience: 1 });
candidateSchema.index({ annualSalary: 1 });
candidateSchema.index({ latestPipelineStage: 1 });
candidateSchema.index({ dateOfApplication: -1 });
candidateSchema.index({ isActive: 1 });

// Compound indexes for common search patterns
candidateSchema.index({ currentLocation: 1, role: 1 });
candidateSchema.index({ keySkills: 1, totalExperience: 1 });
candidateSchema.index({ industry: 1, role: 1 });

export default mongoose.model<ICandidate>('Candidate', candidateSchema); 