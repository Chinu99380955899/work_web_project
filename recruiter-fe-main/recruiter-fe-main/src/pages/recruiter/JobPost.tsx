// import React, { useState, useEffect, ChangeEvent } from "react";
// import {
//   Typography,
//   Button,
//   Tabs,
//   Tab,
//   Box,
//   Card,
//   CardContent,
//   CardActions,
//   TextField,
//   Grid,
//   Paper,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Chip,
// } from "@mui/material";
// import {
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   Download as DownloadIcon,
//   LocationOn as LocationIcon,
//   Work as WorkIcon,
//   School as SchoolIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";
// import { jobApi, jobApplicationApi, candidateApi } from "@/services/api";

// interface Job {
//   _id?: string;
//   companyName: string;
//   jobTitle: string;
//   jobDescription?: string;
//   skills?: string[] | string;
//   location?: string;
//   minExp?: number | string;
//   maxExp?: number | string;
//   minSalary?: number | string;
//   maxSalary?: number | string;
//   createdAt?: string;
// }

// interface Message {
//   type: "success" | "error";
//   text: string;
// }

// interface Applicant {
//   candidateId: string;
//   name?: string;
//   email?: string;
//   phonenumber?: string;
//   appliedAt: string;
//   jobTitle?: string;
//   currentCompanyName?: string;
//   currentLocation?: string;
//   totalExperience?: string;
//   ugDegree?: string;
//   keySkills?: string[];
//   resumeUrl?: string;
// }

// interface RecruiterApplication {
//   jobId: string;
//   jobTitle: string;
//   companyName: string;
//   applicants: Applicant[];
// }

// const JobPost: React.FC = () => {
//   const [tab, setTab] = useState<number>(0);
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [applications, setApplications] = useState<RecruiterApplication[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [msg, setMsg] = useState<Message | null>(null);
//   const [editJob, setEditJob] = useState<Job | null>(null);

//   const [jobData, setJobData] = useState<Job>({
//     companyName: "",
//     jobTitle: "",
//     jobDescription: "",
//     skills: "",
//     location: "",
//     minExp: "",
//     maxExp: "",
//     minSalary: "",
//     maxSalary: "",
//   });

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) =>
//     setTab(newValue);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setJobData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Fetch Logged-in Recruiter's Jobs
//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await jobApi.getMyJobs();
//       const jobList = (res.data as any)?.data;
//       setJobs(Array.isArray(jobList) ? jobList : []);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Fetch recruiter applications
//   const fetchRecruiterApplications = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         "http://localhost:4000/api/job-applications/recruiter/applications",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();

//       if (data.success && Array.isArray(data.data)) {
//         const appsWithCandidates = await Promise.all(
//           data.data.map(async (jobApp: RecruiterApplication) => {
//             const applicantsWithDetails = await Promise.all(
//               jobApp.applicants.map(async (applicant) => {
//                 try {
//                   const candidateRes = await fetch(
//                     `http://localhost:4000/api/candidates/${applicant.candidateId}`,
//                     {
//                       headers: { Authorization: `Bearer ${token}` },
//                     }
//                   );
//                   const candidateData = await candidateRes.json();

//                   if (candidateData.success && candidateData.candidate) {
//                     const c = candidateData.candidate;
//                     return {
//                       ...applicant,
//                       name: c.name,
//                       email: c.email,
//                       phonenumber: c.phoneNumber,
//                       jobTitle: c.jobTitle,
//                       currentCompanyName: c.currentCompanyName,
//                       currentLocation: c.currentLocation,
//                       totalExperience: c.totalExperience,
//                       ugDegree: c.ugDegree,
//                       keySkills: c.keySkills || [],
//                       resumeUrl: c.resumeUrl,
//                     };
//                   } else return applicant;
//                 } catch {
//                   return applicant;
//                 }
//               })
//             );
//             return { ...jobApp, applicants: applicantsWithDetails };
//           })
//         );

//         setApplications(appsWithCandidates);
//       }
//     } catch (error) {
//       console.error("Error fetching recruiter applications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//     fetchRecruiterApplications();
//   }, []);

//   const formatDate = (date: string) =>
//     new Date(date).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//   // ✅ Create Job
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       setMsg(null);
//       if (editJob?._id) {
//         await jobApi.update(editJob._id, jobData);
//         setMsg({ type: "success", text: "Job updated successfully!" });
//         setEditJob(null);
//       } else {
//         await jobApi.create(jobData);
//         setMsg({ type: "success", text: "Job posted successfully!" });
//       }
//       setShowForm(false);
//       fetchJobs();
//       setJobData({
//         companyName: "",
//         jobTitle: "",
//         jobDescription: "",
//         skills: "",
//         location: "",
//         minExp: "",
//         maxExp: "",
//         minSalary: "",
//         maxSalary: "",
//       });
//     } catch (error: any) {
//       console.error("Error posting job:", error);
//       setMsg({
//         type: "error",
//         text: error.response?.data?.message || "Server error, please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Edit Job
//   const handleEdit = (job: Job) => {
//     setEditJob(job);
//     setJobData({
//       companyName: job.companyName || "",
//       jobTitle: job.jobTitle || "",
//       jobDescription: job.jobDescription || "",
//       skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
//       location: job.location || "",
//       minExp: job.minExp || "",
//       maxExp: job.maxExp || "",
//       minSalary: job.minSalary || "",
//       maxSalary: job.maxSalary || "",
//     });
//     setShowForm(true);
//   };

//   // ✅ Delete Job
//   const handleDelete = async (id?: string) => {
//     if (!id) return;
//     if (!window.confirm("Are you sure you want to delete this job?")) return;
//     try {
//       setLoading(true);
//       await jobApi.delete(id);
//       setMsg({ type: "success", text: "Job deleted successfully!" });
//       fetchJobs();
//     } catch (error: any) {
//       console.error("Error deleting job:", error);
//       setMsg({
//         type: "error",
//         text: error.response?.data?.message || "Delete failed, please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ flexGrow: 1, p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Job Posting
//       </Typography>
//       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//         Manage your job postings and view applications
//       </Typography>

//       <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
//         <Tab label="Manage Jobs" />
//         <Tab label="Applications" />
//       </Tabs>

//       {/* ------------------------ Manage Jobs ------------------------ */}
//       {tab === 0 && (
//         <Box>
//           <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//             <Typography variant="h6">Manage Job Postings</Typography>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setShowForm(!showForm);
//                 setEditJob(null);
//                 setJobData({
//                   companyName: "",
//                   jobTitle: "",
//                   jobDescription: "",
//                   skills: "",
//                   location: "",
//                   minExp: "",
//                   maxExp: "",
//                   minSalary: "",
//                   maxSalary: "",
//                 });
//               }}
//             >
//               {showForm ? "Close Form" : "Post New Job"}
//             </Button>
//           </Box>

//           {msg && <Alert severity={msg.type}>{msg.text}</Alert>}

//           {showForm && (
//             <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
//               <Typography variant="h6" gutterBottom>
//                 {editJob ? "Edit Job" : "Post New Job"}
//               </Typography>
//               <Grid container spacing={2}>
//                 {[
//                   { name: "companyName", label: "Company Name" },
//                   { name: "jobTitle", label: "Job Title" },
//                   {
//                     name: "jobDescription",
//                     label: "Job Description",
//                     multiline: true,
//                     rows: 4,
//                   },
//                   { name: "skills", label: "Required Skills (comma separated)" },
//                   { name: "location", label: "Location" },
//                   { name: "minExp", label: "Min Experience (years)" },
//                   { name: "maxExp", label: "Max Experience (years)" },
//                   { name: "minSalary", label: "Min Salary" },
//                   { name: "maxSalary", label: "Max Salary" },
//                 ].map((field, idx) => (
//                   <Grid item xs={12} md={field.rows ? 12 : 6} key={idx}>
//                     <TextField
//                       fullWidth
//                       name={field.name}
//                       label={field.label}
//                       value={(jobData as any)[field.name]}
//                       onChange={handleChange}
//                       multiline={field.multiline || false}
//                       rows={field.rows || 1}
//                     />
//                   </Grid>
//                 ))}
//               </Grid>
//               <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
//                 <Button
//                   variant="contained"
//                   color={editJob ? "warning" : "success"}
//                   onClick={handleSubmit}
//                   disabled={loading}
//                 >
//                   {loading
//                     ? editJob
//                       ? "Updating..."
//                       : "Posting..."
//                     : editJob
//                     ? "Update Job"
//                     : "Post Job"}
//                 </Button>
//               </Box>
//             </Paper>
//           )}

//           {loading ? (
//             <CircularProgress />
//           ) : jobs.length === 0 ? (
//             <Typography color="text.secondary">No jobs posted yet.</Typography>
//           ) : (
//             jobs.map((job) => (
//               <Card sx={{ mb: 2 }} key={job._id}>
//                 <CardContent>
//                   <Typography variant="h6">{job.jobTitle}</Typography>
//                   <Typography color="text.secondary">
//                     {job.companyName} — {job.location}
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button
//                     startIcon={<EditIcon />}
//                     onClick={() => handleEdit(job)}
//                     color="primary"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     startIcon={<DeleteIcon />}
//                     onClick={() => handleDelete(job._id)}
//                     color="error"
//                   >
//                     Delete
//                   </Button>
//                 </CardActions>
//               </Card>
//             ))
//           )}
//         </Box>
//       )}

//       {/* ------------------------ Applications ------------------------ */}
//       {tab === 1 && (
//         <Box>
//           <Typography variant="h6" gutterBottom>
//             Candidates Who Applied
//           </Typography>
//           {loading ? (
//             <CircularProgress />
//           ) : applications.length === 0 ? (
//             <Typography color="text.secondary">
//               No applications received yet.
//             </Typography>
//           ) : (
//             applications.map((job) => (
//               <Box key={job.jobId} sx={{ mb: 3 }}>
//                 <Typography variant="h6" sx={{ mb: 2 }}>
//                   {job.jobTitle} — {job.companyName}
//                 </Typography>
//                 {job.applicants.map((candidate, index) => (
//                   <Card key={index} sx={{ mb: 2, p: 1 }}>
//                     <CardContent>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} md={8}>
//                           <Typography variant="h6">{candidate.name}</Typography>
//                           <Typography color="textSecondary" gutterBottom>
//                             {candidate.jobTitle} at{" "}
//                             {candidate.currentCompanyName}
//                           </Typography>

//                           <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
//                             <Typography
//                               variant="body2"
//                               sx={{ display: "flex", alignItems: "center" }}
//                             >
//                               <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
//                               {candidate.currentLocation || "N/A"}
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               sx={{ display: "flex", alignItems: "center" }}
//                             >
//                               <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
//                               {candidate.totalExperience || "0"} years
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               sx={{ display: "flex", alignItems: "center" }}
//                             >
//                               <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
//                               {candidate.ugDegree || "N/A"}
//                             </Typography>
//                           </Box>

//                           <Box sx={{ mb: 1 }}>
//                             {candidate.keySkills?.map((skill) => (
//                               <Chip
//                                 key={skill}
//                                 label={skill}
//                                 size="small"
//                                 sx={{ mr: 0.5, mb: 0.5 }}
//                               />
//                             ))}
//                           </Box>

//                           <Typography variant="body2" color="textSecondary">
//                             Applied on: {formatDate(candidate.appliedAt)}
//                           </Typography>
//                         </Grid>

//                         <Grid
//                           item
//                           xs={12}
//                           md={4}
//                           sx={{ display: "flex", justifyContent: "flex-end" }}
//                         >
//                           <CardActions>
//                             <IconButton
//                               color="primary"
//                               onClick={() =>
//                                 window.open(`mailto:${candidate.email}`)
//                               }
//                             >
//                               <EmailIcon />
//                             </IconButton>
//                             <IconButton
//                               color="primary"
//                               onClick={() =>
//                                 window.open(`tel:${candidate.phonenumber}`)
//                               }
//                             >
//                               <PhoneIcon />
//                             </IconButton>
//                             {candidate.resumeUrl && (
//                               <IconButton
//                                 color="primary"
//                                 onClick={() =>
//                                   window.open(candidate.resumeUrl, "_blank")
//                                 }
//                               >
//                                 <DownloadIcon />
//                               </IconButton>
//                             )}
//                           </CardActions>
//                         </Grid>
//                       </Grid>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </Box>
//             ))
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default JobPost;



import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Download as DownloadIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { jobApi, jobApplicationApi, candidateApi } from "@/services/api";

interface Job {
  _id?: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  skills?: string[] | string;
  location?: string;
  minExp?: number | string;
  maxExp?: number | string;
  minSalary?: number | string;
  maxSalary?: number | string;
  createdAt?: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

interface Applicant {
  candidateId: string;
  name?: string;
  email?: string;
  phonenumber?: string;
  appliedAt: string;
  jobTitle?: string;
  currentCompanyName?: string;
  currentLocation?: string;
  totalExperience?: string;
  ugDegree?: string;
  keySkills?: string[];
  resumeUrl?: string;
}

interface RecruiterApplication {
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicants: Applicant[];
}

const JobPost: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<Message | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);

  const [jobData, setJobData] = useState<Job>({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    skills: "",
    location: "",
    minExp: "",
    maxExp: "",
    minSalary: "",
    maxSalary: "",
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  //  Fetch Logged-in Recruiter's Jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobApi.getMyJobs();
      const jobList = (res.data as any)?.data;
      setJobs(Array.isArray(jobList) ? jobList : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch recruiter applications
const fetchRecruiterApplications = async () => {
  try {
    setLoading(true);
    const apiResponse: any = await jobApplicationApi.getRecruiterApplications();

    //  Ensure correct response structure
    const recruiterApps = Array.isArray(apiResponse?.data)
      ? apiResponse.data
      : apiResponse?.data?.applications || [];

    if (recruiterApps.length === 0) {
      console.warn(" No recruiter applications found");
      setApplications([]);
      return;
    }

    //  Properly map applicants with candidate details
    const appsWithCandidates = await Promise.all(
      recruiterApps.map(async (jobApp: any) => {
        const applicants = Array.isArray(jobApp.applicants)
          ? jobApp.applicants
          : [];

        const applicantsWithDetails = await Promise.all(
          applicants.map(async (applicant: any) => {
            try {
              const candidateApiResponse: any = await candidateApi.getById(
                applicant.candidateId
              );

              console.log("Candidate API Response:", candidateApiResponse);

              const candidateData =
                candidateApiResponse?.data?.candidate ||
                candidateApiResponse?.candidate;

              if (!candidateData) return applicant;

              return {
                ...applicant,
                name: candidateData.name || "N/A",
                email: candidateData.email || "N/A",
                phonenumber: candidateData.phoneNumber || "N/A",
                jobTitle: candidateData.jobTitle || "N/A",
                currentCompanyName: candidateData.currentCompanyName || "N/A",
                currentLocation: candidateData.currentLocation || "N/A",
                totalExperience: candidateData.totalExperience?.toString() || "0",
                ugDegree: candidateData.ugDegree || "N/A",
                keySkills: candidateData.keySkills || [],
                resumeUrl: candidateData.resumeUrl || "",
              };
            } catch (error) {
              console.warn("Error fetching candidate:", error);
              return applicant;
            }
          })
        );

        //  Return new job application with candidate details
        return { ...jobApp, applicants: applicantsWithDetails };
      })
    );

    console.log(" Recruiter Applications with Candidates:", appsWithCandidates);

    //  Force rerender with new array (important!)
    setApplications([...appsWithCandidates]);
  } catch (error) {
    console.error(" Error fetching recruiter applications:", error);
    setApplications([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchJobs();
    fetchRecruiterApplications();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  //  Create Job
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMsg(null);
      if (editJob?._id) {
        await jobApi.update(editJob._id, jobData);
        setMsg({ type: "success", text: "Job updated successfully!" });
        setEditJob(null);
      } else {
        await jobApi.create(jobData);
        setMsg({ type: "success", text: "Job posted successfully!" });
      }
      setShowForm(false);
      fetchJobs();
      setJobData({
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        skills: "",
        location: "",
        minExp: "",
        maxExp: "",
        minSalary: "",
        maxSalary: "",
      });
    } catch (error: any) {
      console.error("Error posting job:", error);
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Server error, please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  //  Edit Job
  const handleEdit = (job: Job) => {
    setEditJob(job);
    setJobData({
      companyName: job.companyName || "",
      jobTitle: job.jobTitle || "",
      jobDescription: job.jobDescription || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      location: job.location || "",
      minExp: job.minExp || "",
      maxExp: job.maxExp || "",
      minSalary: job.minSalary || "",
      maxSalary: job.maxSalary || "",
    });
    setShowForm(true);
  };

  //  Delete Job
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      setLoading(true);
      await jobApi.delete(id);
      setMsg({ type: "success", text: "Job deleted successfully!" });
      fetchJobs();
    } catch (error: any) {
      console.error("Error deleting job:", error);
      setMsg({
        type: "error",
        text: error.response?.data?.message || "Delete failed, please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Posting
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your job postings and view applications
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Manage Jobs" />
        <Tab label="Applications" />
      </Tabs>

      {/* Manage Jobs */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Manage Job Postings</Typography>
            <Button
              variant="contained"
              onClick={() => {
                setShowForm(!showForm);
                setEditJob(null);
                setJobData({
                  companyName: "",
                  jobTitle: "",
                  jobDescription: "",
                  skills: "",
                  location: "",
                  minExp: "",
                  maxExp: "",
                  minSalary: "",
                  maxSalary: "",
                });
              }}
            >
              {showForm ? "Close Form" : "Post New Job"}
            </Button>
          </Box>

          {msg && <Alert severity={msg.type}>{msg.text}</Alert>}

          {showForm && (
            <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
              <Typography variant="h6" gutterBottom>
                {editJob ? "Edit Job" : "Post New Job"}
              </Typography>
              <Grid container spacing={2}>
                {[
                  { name: "companyName", label: "Company Name" },
                  { name: "jobTitle", label: "Job Title" },
                  {
                    name: "jobDescription",
                    label: "Job Description",
                    multiline: true,
                    rows: 4,
                  },
                  { name: "skills", label: "Required Skills (comma separated)" },
                  { name: "location", label: "Location" },
                  { name: "minExp", label: "Min Experience (years)" },
                  { name: "maxExp", label: "Max Experience (years)" },
                  { name: "minSalary", label: "Min Salary" },
                  { name: "maxSalary", label: "Max Salary" },
                ].map((field, idx) => (
                  <Grid item xs={12} md={field.rows ? 12 : 6} key={idx}>
                    <TextField
                      fullWidth
                      name={field.name}
                      label={field.label}
                      value={(jobData as any)[field.name]}
                      onChange={handleChange}
                      multiline={field.multiline || false}
                      rows={field.rows || 1}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color={editJob ? "warning" : "success"}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? editJob
                      ? "Updating..."
                      : "Posting..."
                    : editJob
                    ? "Update Job"
                    : "Post Job"}
                </Button>
              </Box>
            </Paper>
          )}

          {loading ? (
            <CircularProgress />
          ) : jobs.length === 0 ? (
            <Typography color="text.secondary">No jobs posted yet.</Typography>
          ) : (
            jobs.map((job) => (
              <Card sx={{ mb: 2 }} key={job._id}>
                <CardContent>
                  <Typography variant="h6">{job.jobTitle}</Typography>
                  <Typography color="text.secondary">
                    {job.companyName} — {job.location}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(job)}
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(job._id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Applications */}
      {tab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Candidates Who Applied
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : applications.length === 0 ? (
            <Typography color="text.secondary">
              No applications received yet.
            </Typography>
          ) : (
            applications.map((job) => (
              <Box key={job.jobId} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {job.jobTitle} — {job.companyName}
                </Typography>
                {job.applicants.map((candidate, index) => (
                  <Card key={index} sx={{ mb: 2, p: 1 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6">{candidate.name}</Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {candidate.jobTitle} at{" "}
                            {candidate.currentCompanyName}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {candidate.currentLocation || "N/A"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {candidate.totalExperience || "0"} years
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {candidate.ugDegree || "N/A"}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 1 }}>
                            {candidate.keySkills?.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>

                          <Typography variant="body2" color="textSecondary">
                            Applied on: {formatDate(candidate.appliedAt)}
                          </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={4}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <CardActions>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                window.open(`mailto:${candidate.email}`)
                              }
                            >
                              <EmailIcon />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                window.open(`tel:${candidate.phonenumber}`)
                              }
                            >
                              <PhoneIcon />
                            </IconButton>
                            {candidate.resumeUrl && (
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  window.open(candidate.resumeUrl, "_blank")
                                }
                              >
                                <DownloadIcon />
                              </IconButton>
                            )}
                          </CardActions>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default JobPost;