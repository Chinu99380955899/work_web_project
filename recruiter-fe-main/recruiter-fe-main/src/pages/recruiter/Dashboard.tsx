import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  PostAdd as PostAddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { candidateApi, authApi } from "@/services/api";
import { Candidate, User } from "@/types";

//  Helper function to format date nicely
const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

//  Reusable card for allowed actions
const CardAction: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  navigate: (path: string) => void;
}> = ({ title, description, icon, route, navigate }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(route)}>
          Open
        </Button>
      </CardActions>
    </Card>
  </Grid>
);

// Reusable card for blocked actions
const CardBlocked: React.FC<{ message: string }> = ({ message }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ opacity: 0.6 }}>
      <CardContent>
        <Typography variant="body2" color="error">
          {message}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchRecentCandidates();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data.user);
    } catch (err: any) {
      console.error("Failed to fetch profile:", err.message);
    }
  };

  const fetchRecentCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await candidateApi.search({ page: 1, limit: 5 });
      if (response.data) {
        setRecentCandidates(response.data.candidates);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch recent candidates");
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (perm: string) => user?.permissions?.includes(perm);

  if (!user) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your profile...</Typography>
      </Box>
    );
  }

  if (!user.permissions || user.permissions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h6" color="error">
          You have no permission to access this dashboard.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Recruiter Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/*Quick Actions Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>

            <Grid container spacing={2}>
              {hasPermission("search") ? (
                <CardAction
                  title="Search Candidates"
                  description="Search and filter candidates based on location, skills, and more."
                  icon={<SearchIcon color="primary" />}
                  route="/recruiter/search"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission to search candidates." />
              )}

              {hasPermission("bulk_upload") ? (
                <CardAction
                  title="Bulk Upload"
                  description="Upload multiple candidates using CSV format."
                  icon={<CloudUploadIcon color="primary" />}
                  route="/recruiter/upload"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission for Bulk Upload." />
              )}

              {hasPermission("manage_trackers") ? (
                <CardAction
                  title="Export Trackers"
                  description="Manage and use custom export formats."
                  icon={<DescriptionIcon color="primary" />}
                  route="/recruiter/trackers"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission to manage trackers." />
              )}

              {hasPermission("single_upload") ? (
                <CardAction
                  title="Add Candidate"
                  description="Manually add a new candidate profile."
                  icon={<PersonIcon color="primary" />}
                  route="/recruiter/upload"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission to add candidates." />
              )}

              {hasPermission("funnel_data") ? (
                <CardAction
                  title="Funnel"
                  description="Create New Sales Funnel."
                  icon={<PostAddIcon color="primary" />}
                  route="/recruiter/vizlogiclist"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission Create Funnel." />
              )}
              {hasPermission("sales_funnel_data") ? (
                <CardAction
                  title="New Sales Funnel"
                  description="Create New Sales Funnel."
                  icon={<PostAddIcon color="primary" />}
                  route="/recruiter/salesfunnel"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission Create New Sales Funnel" />
              )}
              {hasPermission("job_post") ? (
                <CardAction
                  title="Job Post"
                  description="Create Job Post."
                  icon={<PostAddIcon color="primary" />}
                  route="/recruiter/jobpost"
                  navigate={navigate}
                />
              ) : (
                <CardBlocked message="You don’t have permission Create job post" />
              )}
            </Grid>
          </Paper>
        </Grid>

        {/*  Enhanced Recent Candidates Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Candidates
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Applied On</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentCandidates.length > 0 ? (
                      recentCandidates.map((candidate) => (
                        <TableRow key={candidate._id}>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.jobTitle}</TableCell>
                          <TableCell>{candidate.currentLocation}</TableCell>
                          <TableCell>
                            {candidate.totalExperience || 0} years
                          </TableCell>
                          <TableCell>
                            {formatDate(String(candidate.dateOfApplication))}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={candidate.latestPipelineStage || "New"}
                              size="small"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                navigate(`/candidate/profile/${candidate._id}`)
                              }
                            >
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No recent candidates found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/recruiter/search")}
              >
                View All Candidates
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   CircularProgress,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   CloudUpload as CloudUploadIcon,
//   Description as DescriptionIcon,
//   Person as PersonIcon,
//   PostAdd as PostAddIcon,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { candidateApi } from "@/services/api";
// import { Candidate } from "@/types";

// export const RecruiterDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchRecentCandidates();
//   }, []);

//   const fetchRecentCandidates = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await candidateApi.search({
//         page: 1,
//         limit: 5,
//       });
//       if (response.data) {
//         setRecentCandidates(response.data.candidates);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch recent candidates");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDate = (date: Date) => {
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Recruiter Dashboard
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Quick Actions */}
//         <Grid item xs={12}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Quick Actions
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <SearchIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6">Search Candidates</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Search and filter candidates based on location, skills,
//                       and more.
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/search")}
//                     >
//                       Search Now
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <CloudUploadIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6">Bulk Upload</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Upload multiple candidates using CSV format.
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/upload")}
//                     >
//                       Upload CSV
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <DescriptionIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6">Export Trackers</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Manage and use custom export formats.
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/trackers")}
//                     >
//                       Manage Trackers
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <PersonIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6">Add Candidate</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Manually add a new candidate profile.
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/upload")}
//                     >
//                       Add New
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <PersonIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6"> Sales Funnel</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">

//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/vizlogiclist")}
//                     >
//                       Add New
//                     </Button>
//                     {/* <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/funneldata")}
//                     >
//                       Added Funnel
//                     </Button> */}
//                   </CardActions>
//                 </Card>
//               </Grid>
//                 <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <PersonIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6">New Sales Funnel</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">

//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/salesfunnel")}
//                     >
//                       Add New
//                     </Button>
//                     {/* <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/funneldata")}
//                     >
//                       Added Funnel
//                     </Button> */}
//                   </CardActions>
//                 </Card>
//               </Grid>
//               {/* <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//                       <PostAddIcon color="primary" sx={{ mr: 1 }} />
//                       <Typography variant="h6">Post Job</Typography>
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">

//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       onClick={() => navigate("/recruiter/jobpost")}
//                     >
//                       Post
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid> */}

//             </Grid>
//           </Paper>
//         </Grid>

//         {/* Recent Candidates */}
//         <Grid item xs={12}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//               Recent Candidates
//             </Typography>

//             {error && (
//               <Alert severity="error" sx={{ mb: 2 }}>
//                 {error}
//               </Alert>
//             )}

//             {isLoading ? (
//               <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
//                 <CircularProgress />
//               </Box>
//             ) : (
//               <TableContainer>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Role</TableCell>
//                       <TableCell>Location</TableCell>
//                       <TableCell>Experience</TableCell>
//                       <TableCell>Applied On</TableCell>
//                       <TableCell>Status</TableCell>
//                       <TableCell align="right">Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {recentCandidates.map((candidate) => (
//                       <TableRow key={candidate._id}>
//                         <TableCell>{candidate.name}</TableCell>
//                         <TableCell>{candidate.jobTitle}</TableCell>
//                         <TableCell>{candidate.currentLocation}</TableCell>
//                         <TableCell>{candidate.totalExperience} years</TableCell>
//                         <TableCell>
//                           {formatDate(candidate.dateOfApplication)}
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={candidate.latestPipelineStage || "New"}
//                             size="small"
//                             color="primary"
//                           />
//                         </TableCell>
//                         <TableCell align="right">
//                           <Button
//                             size="small"
//                             onClick={() => navigate(`/candidate/profile`)}
//                           >
//                             View Profile
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}

//             <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
//               <Button
//                 variant="outlined"
//                 onClick={() => navigate("/recruiter/search")}
//               >
//                 View All Candidates
//               </Button>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };
