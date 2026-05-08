"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const candidateSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    resumeHeadline: {
        type: String,
        trim: true,
    },
    summary: {
        type: String,
        trim: true,
    },
    experience: {
        type: Array,
        default: [],
    },
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
    lastWorkflowActivity: {
        type: String,
        trim: true,
    },
    lastWorkflowActivityBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    timeWhenStageUpdated: {
        type: Date,
        default: Date.now,
    },
    resumeUrl: {
        type: String,
        trim: true,
    },
    downloaded: {
        type: Boolean,
        default: false,
    },
    downloadedBy: [{
            type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
    timeOfEmail: [{
            type: Date,
        }],
    callingStatus: {
        type: String,
        enum: ['Not Called', 'Called', 'Interested', 'Not Interested', 'Callback Required'],
        default: 'Not Called',
    },
    callingStatusUpdatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    timeOfCallingActivityUpdate: {
        type: Date,
    },
    comments: [{
            text: {
                type: String,
                required: true,
                trim: true,
            },
            commentBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            timePosted: {
                type: Date,
                default: Date.now,
            },
        }],
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
candidateSchema.index({ currentLocation: 1, role: 1 });
candidateSchema.index({ keySkills: 1, totalExperience: 1 });
candidateSchema.index({ industry: 1, role: 1 });
exports.default = mongoose_1.default.model('Candidate', candidateSchema);
//# sourceMappingURL=Candidate.js.map