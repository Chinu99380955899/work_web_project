import axios, { AxiosInstance } from "axios";
import {
  ApiResponse,
  LoginResponse,
  User,
  Candidate,
  Tracker,
  SearchFilters,
  SearchResponse,
  SystemStats,
  CSVImportSummary,
} from "@/types";

export interface RequirementFormData {
   dateOfReceipt: string; 
   customerName: string; 
   projectName: string; 
   taSpoc: string; 
   referenceNo: string; 
   skill: string; 
   countRequired: number | ''; 
   opportunityType: string; 
   expRequired: string; 
   location: string; 
   noticePeriod: string; 
   budget: string; 
   ageing: string; 
   accountManager: string; 
   accountdirector: string; 
   recruiterName: string; 
   cvsShared: number | ''; 
   status: string; 
   createdBy?: string; }

   export interface SalesfunnelFormData {
    _id?: string;
    dateOfFunnelGeneration: string;
  accountManager: string;
  lead: string;
  customerName: string;
  projectName: string;
  location: string;
  opportunityType: string;
  opportunityDescription: string;
  approximateValue: number;
  status: string;
  expectedClosureMonth: string;
  projectedRevenue: number;
  // createBy: string;
  
   createdBy?: string; 
  }

   const baseApi = "http://localhost:4000/api";
// const baseApi = "https://vizlogiccloud.com/recruiter/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: baseApi,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  sendOtp: (phoneNumber: string): Promise<ApiResponse> =>
    api.post("/auth/send-otp", { phoneNumber }),

  verifyOtp: (
    phoneNumber: string,
    otp: string
  ): Promise<{ data: LoginResponse }> =>
    api.post("/auth/verify-otp", { phoneNumber, otp }),

  getProfile: (): Promise<{ data: { success: boolean; user: User } }> =>
    api.get("/auth/me"),

  updateProfile: (
    data: Partial<User>
  ): Promise<{ data: { success: boolean; user: User } }> =>
    api.patch("/auth/me", data),
};

// Candidate API
export const candidateApi = {
  createProfile: (data: Partial<Candidate>): Promise<ApiResponse<Candidate>> =>
    api.post("/candidates", data),

  uploadSingle: (data: Partial<Candidate>): Promise<ApiResponse<Candidate>> =>
    api.post("/candidates/upload", data),

  getProfile: (): Promise<{
    data: { success: boolean; candidate: Candidate };
  }> => api.get("/candidates/me"),

  updateProfile: (
    id: string,
    data: Partial<Candidate>
  ): Promise<ApiResponse<Candidate>> => api.patch(`/candidates/${id}`, data),

  search: (filters: SearchFilters): Promise<ApiResponse<SearchResponse>> =>
    api.get("/candidates/search", { params: filters }),

  updateWorkflow: (
    id: string,
    stage: string,
    comment?: string
  ): Promise<ApiResponse<Candidate>> =>
    api.patch(`/candidates/${id}/workflow`, { stage, comment }),

  export: (trackerId: string, candidateIds: string[]): Promise<Blob> =>
    api.post(
      "/candidates/export",
      { trackerId, candidateIds },
      { responseType: "blob" }
    ),

  //  getById: (id: string): Promise<ApiResponse<Candidate>> =>
  // api.get(`/candidates/${id}`),

   getById: async (id: string): Promise<ApiResponse<Candidate>> => {
  const { data } = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`);
  return data;
},


  // //  export const candidateApi = {
  // getById: (id: string) => axiosInstance.get(`/candidates/${id}`),


};

// Upload API
export const uploadApi = {
  uploadResume: (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/upload/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  parseResume: (file: File): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append("resume", file);
    return api.post("/upload/parse-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadBulkCandidates: (
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<CSVImportSummary>> => {
    return api.post("/upload/bulk-candidates", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  },
};

// Tracker API
export const trackerApi = {
  create: (data: Partial<Tracker>): Promise<ApiResponse<Tracker>> =>
    api.post("/trackers", data),

  getAll: (): Promise<ApiResponse<Tracker[]>> => api.get("/trackers"),

  getById: (id: string): Promise<ApiResponse<Tracker>> =>
    api.get(`/trackers/${id}`),

  update: (id: string, data: Partial<Tracker>): Promise<ApiResponse<Tracker>> =>
    api.patch(`/trackers/${id}`, data),

  delete: (id: string): Promise<ApiResponse> => api.delete(`/trackers/${id}`),
};

// Admin API
export const adminApi = {
  createRecruiter: (data: {
    phoneNumber: string;
    email: string;
    permissions: string[];
  }): Promise<ApiResponse<User>> => api.post("/admin/recruiters", data),

  getRecruiters: (): Promise<{
    data: { success: boolean; recruiters: User[] };
  }> => api.get("/admin/recruiters"),

  updateRecruiter: (
    id: string,
    data: { permissions?: string[]; isActive?: boolean }
  ): Promise<ApiResponse<User>> => api.patch(`/admin/recruiters/${id}`, data),

  deleteRecruiter: (id: string): Promise<ApiResponse> =>
    api.delete(`/admin/recruiters/${id}`),

  getStats: (): Promise<{ data: { success: boolean; stats: SystemStats } }> =>
    api.get("/admin/stats"),
};

// Funnel API
export const funnelApi = {
  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("/funnel", data),

  getAll: (): Promise<ApiResponse<any[]>> =>
    api.get("/funnel"),

  getMyFunnels: (userId: string): Promise<ApiResponse<RequirementFormData[]>> =>
  api.get(`/funnel/my-funnels/${userId}`),
  
  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/funnel/${id}`),

  update: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.patch(`/funnel/${id}`, data),

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/funnel/${id}`),
};

// Sales Funnel API
export const salesFunnelApi = {
  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("/sales-funnel", data),

  // getAll: (): Promise<ApiResponse<any[]>> =>
  //   api.get("/sales-funnel"),


   getAll: (): Promise<{ data: ApiResponse<SalesfunnelFormData[]> }> =>
    api.get<ApiResponse<SalesfunnelFormData[]>>("/sales-funnel"),

  getMysalesFunnels: (userId: string): Promise<ApiResponse<SalesfunnelFormData[]>> =>
  api.get(`/sales-funnel/my-salesfunnels/${userId}`),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/sales-funnel/${id}`),

  update: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.patch(`/sales-funnel/${id}`, data),

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/sales-funnel/${id}`),
};


// Job API
export const jobApi = {
  
  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("/jobs", data),

   getAll: (): Promise<ApiResponse<any[]>> =>
    api.get("/jobs"),


  getMyJobs: (): Promise<ApiResponse<any[]>> =>
    api.get("/jobs/my-jobs"),

  
  update: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.put(`/jobs/${id}`, data),

  
  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/jobs/${id}`),
};

// jobApplicationApi

export const jobApplicationApi = {

  apply: (jobId: string): Promise<ApiResponse<any>> =>
    api.post("/job-applications/job/apply", { jobId }),


  getMyApplications: async (): Promise<ApiResponse<any[]>> => {
    const { data } = await api.get<ApiResponse<any[]>>("/job-applications/my-applications");
    return data;
  },

  getRecruiterApplications: async (): Promise<ApiResponse<any[]>> => {
    const { data } = await api.get<ApiResponse<any[]>>("/job-applications/recruiter/applications");
    return data;
  },

  
};

export const excelApi = {
  uploadExcel: (formData: FormData) => api.post("/excel/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};




export default api;