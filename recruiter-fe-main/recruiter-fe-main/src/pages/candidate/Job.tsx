import  { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Alert,
} from "@mui/material";
import { jobApi, jobApplicationApi } from "@/services/api"; // ✅ import from api.ts
import ViewDetals from "./ViewDetals";

const Job = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  //  Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const res: any = await jobApi.getAll();

        console.log("Raw jobs API response:", res);

        let jobsArray: any[] = [];

        if (Array.isArray(res)) {
          jobsArray = res;
        } else if (Array.isArray(res?.data)) {
          jobsArray = res.data;
        } else if (Array.isArray(res?.jobs)) {
          jobsArray = res.jobs;
        } else if (Array.isArray(res?.data?.data)) {
          jobsArray = res.data.data;
        } else {
          console.warn(" Jobs response not in expected array format:", res);
        }

        setJobs(jobsArray);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!token) return;
      try {
        const res = await jobApplicationApi.getMyApplications();
        const jobIds =
          res.data?.map((job: any) => job._id || job.jobId?._id || job.jobId) ||
          [];
        setAppliedJobs(jobIds);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
      }
    };
    fetchAppliedJobs();
  }, [token]);

  //  Apply for job
  const handleApply = async (jobId: string) => {
    try {
      if (!token) {
        setApplyMsg("Please login to apply for a job.");
        return;
      }

      const res = await jobApplicationApi.apply(jobId);
      setApplyMsg(res.data.message || "Job applied successfully!");
      setAppliedJobs((prev) => [...prev, jobId]);
    } catch (error: any) {
      if (error.response) {
        setApplyMsg(error.response.data.message || " Failed to apply.");
      } else {
        setApplyMsg("Something went wrong.");
      }
    }

    setTimeout(() => setApplyMsg(null), 4000);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Available Jobs
      </Typography>

      {applyMsg && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {applyMsg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job._id}>
            <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    sx={{ fontWeight: 600 }}
                    variant="h6"
                    gutterBottom
                  >
                    {job.jobTitle}
                  </Typography>
                  <Typography color="info.main" sx={{ fontWeight: 600 }}>
                    {job.companyName}
                  </Typography>
                  <Typography>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {job.experienceRequired || "Experience not specified"}
                </Typography>

                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "9px",
                    fontSize: "14px",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: "14px" }}
                  >
                    📍 {job.location || "N/A"}
                  </Typography>
                  {/* <Typography variant="body1" color="text.secondary" sx={{ fontSize: "14px" }}>
                    💼 {job.jobType || "Full-time"}
                  </Typography> */}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: "14px" }}
                  >
                    ⏰{" "}
                    {job.minExp && job.maxExp
                      ? `${job.minExp} to ${job.maxExp} years`
                      : job.minExp
                      ? `${job.minExp} years`
                      : "Experience not specified"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "green", fontWeight: 600 }}
                  >
                    💰{" "}
                    {job.minSalary && job.maxSalary
                      ? `${job.minSalary} to ${job.maxSalary} LPA`
                      : job.minSalary
                      ? `${job.minSalary} LPA`
                      : "Experience not specified"}
                  </Typography>
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ fontSize: "14px", mt: 1 }}
                >
                  {Array.isArray(job.skills)
                    ? job.skills.join(", ")
                    : typeof job.skills === "string"
                    ? job.skills.split(",").join(", ")
                    : "Skills not specified"}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ fontSize: "14px", mt: 1 }}
                >
                  {job.description?.substring(0, 100) ||
                    "No description available"}
                  ...
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      background:
                        "linear-gradient(135deg, #985189ff 0%, #b20c88ff 100%)",
                      fontWeight: 600,
                      textTransform: "none",
                      color: "white",
                    }}
                    onClick={() => {
                      setSelectedJob(job);
                      setOpen(true);
                    }}
                  >
                    View Details
                  </Button>

                  {appliedJobs.includes(job._id) ? (
                    <Button
                      variant="contained"
                      disabled
                      sx={{
                        background: "gray",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "6px",
                        px: 3,
                      }}
                    >
                      Applied
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        background:
                          "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "6px",
                        px: 3,
                      }}
                      onClick={() => handleApply(job._id)}
                    >
                      Apply Now
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedJob && (
        <ViewDetals
          open={open}
          onClose={() => setOpen(false)}
          job={selectedJob}
        />
      )}
    </Box>
  );
};

export default Job;
