// User types
export interface User {
  id?: string; // For API responses
  _id?: string; // For database consistency
  phoneNumber: string;
  email?: string;
  role: "candidate" | "recruiter" | "admin";
  isVerified: boolean;
  permissions?: string[];
  createdBy?: string;
  lastLogin?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
// export interface Certification {
//   name: string;
//   certificationID?: string;
//   startDate?: Date;
//   endDate?: Date;
// }
// Candidate types
export interface Candidate {
  _id: string;
  userId: string;
  jobTitle: string;
  dateOfApplication: Date;
  name: string;
  email: string;
  phoneNumber: string;
  pan?: string;
  currentLocation?: string;
  preferredLocations?: string[];
  totalExperience?: number;
  // Previous company name

  // organization?: string;
  // designation?: string;
  // startDate?: Date;
  // endDate?: Date;

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
    department?: string;
    role?: string;
    industry?: string;
    keySkills?: string[];
    annualSalary?: number;
    noticePeriod?: string;
    resumeHeadline?: string;
    summary?: string;
    workStart?: Date | string;
    workEnd?: Date | string | null;
    isCurrent?: boolean;
  }>;
  resumeHeadline?: string;
  summary?: string;
  tenthSchool?: string;
  tenthBoard?: string;
  tenthCgpa?: string;
  tenthpassingyear?: string;
  twelfthSchool?: string;
  twelfthBoard?: string;
  twelfthCgpa?: string;
  twelfthpassingyear?: string;
  ugDegree?: string;
  ugSpecialization?: string;
  ugUniversity?: string;
  ugGraduationYear?: number;
  pgDegree?: string;
  pgSpecialization?: string;
  pgUniversity?: string;
  pgGraduationYear?: number;

  

  doctorateDegree?: string;
  doctorateSpecialization?: string;
  doctorateUniversity?: string;
  doctorateGraduationYear?: number;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  maritalStatus?: "Single" | "Married" | "Divorced" | "Widowed" | "Other";
  homeTown?: string;
  pinCode?: string;
  workPermitUSA?: boolean;
  dateOfBirth?: Date;
  permanentAddress?: string;
  resumeUrl?: string;

  // Workflow and tracking fields
  lastWorkflowActivity?: string;
  lastWorkflowActivityBy?: string;
  timeOfLastWorkflowActivityUpdate?: Date;
  latestPipelineStage?: string;
  pipelineStatusUpdatedBy?: string;
  timeWhenStageUpdated?: Date;
  downloaded?: boolean;
  downloadedBy?: string;
  timeOfDownload?: Date;
  viewed?: boolean;
  viewedBy?: string;
  timeOfView?: Date;
  emailed?: boolean;
  emailedBy?: string;
  timeOfEmail?: Date;
  callingStatus?: string;
  callingStatusUpdatedBy?: string;
  timeOfCallingActivityUpdate?: Date;
  comment1?: string;
  comment1By?: string;
  timeComment1Posted?: Date;
  comment2?: string;
  comment2By?: string;
  timeComment2Posted?: Date;
  comment3?: string;
  comment3By?: string;
  timeComment3Posted?: Date;
  comment4?: string;
  comment4By?: string;
  timeComment4Posted?: Date;
  comment5?: string;
  comment5By?: string;
  timeComment5Posted?: Date;
  source?: string;
  candidateProfile?: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tracker types
export interface TrackerField {
  candidateField: string;
  displayName: string;
  order: number;
  isRequired: boolean;
}

export interface Tracker {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  companyName?: string;
  fields: TrackerField[];
  isDefault: boolean;
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Search types
export interface SearchFilters {
  location?: string;
  role?: string;
  skills?: string[];
  experience?: string;
  salary?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  candidates: Candidate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// File upload types
export interface UploadResponse {
  success: boolean;
  message: string;
  fileUrl: string;
}

// CSV import types
export interface CSVImportSummary {
  total: number;
  successful: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

// System stats types
export interface SystemStats {
  users: {
    total: number;
    candidates: number;
    recruiters: number;
    admins: number;
  };
  activity: {
    activeUsers: number;
    verifiedUsers: number;
  };
}

// Theme types
export type ThemeMode = "light" | "dark";

// Navigation types
export interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  permissions?: string[];
  roles?: string[];
}
