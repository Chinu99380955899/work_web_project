// ---------- imports ----------
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import { funnelApi } from "@/services/api";
import jwt_decode from "jwt-decode";

// ---------- interfaces ----------

export interface RequirementFormData {
  dateOfReceipt: string;
  customerName: string;
  projectName: string;
  taSpoc: string;
  referenceNo: string;
  skill: string;
  countRequired: number | "";
  opportunityType: string;
  expRequired: string;
  location: string;
  noticePeriod: string;
  budget: string;
  ageing: string;
  accountManager: string;
  accountdirector: string;
  recruiterName: string;
  cvsShared: number | "";
  status: string;
  createdBy?: string;
}

interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

// ---------- component ----------
const VizlogiccreateList: React.FC = () => {
  const [formData, setFormData] = useState<RequirementFormData>({
    dateOfReceipt: "",
    customerName: "",
    projectName: "",
    taSpoc: "",
    referenceNo: "",
    skill: "",
    countRequired: "",
    opportunityType: "",
    expRequired: "",
    location: "",
    noticePeriod: "",
    budget: "",
    ageing: "",
    accountManager: "",
    accountdirector: "",
    recruiterName: "",
    cvsShared: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [funnelData, setFunnelData] = useState<RequirementFormData[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [view, setView] = useState<"form" | "table">("form"); // 👈 switch between form and table

  // ---------- Decode user from token ----------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: TokenPayload = jwt_decode(token);
      setUserId(decoded.userId);
    }
  }, []);

  // ---------- Fetch submitted data ----------
  const fetchFunnelData = async () => {
    if (!userId) return;

    try {
      const response = await funnelApi.getMyFunnels(userId);
      console.log("Fetched funnel data:", response);

      if (Array.isArray(response.data)) {
        setFunnelData(response.data);
      } else {
        setFunnelData([]);
      }
    } catch (error) {
      console.error(" Error fetching funnel data:", error);
      setFunnelData([]);
    }
  };

  useEffect(() => {
    if (userId) fetchFunnelData();
  }, [userId]);

  // ---------- Form handlers ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "countRequired" || name === "cvsShared"
        ? value === ""
          ? ""
          : parseInt(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await funnelApi.create({ ...formData, createdBy: userId });
      alert(" Form data saved successfully!");

      // Reset form
      setFormData({
        dateOfReceipt: "",
        customerName: "",
        projectName: "",
        taSpoc: "",
        referenceNo: "",
        skill: "",
        countRequired: "",
        opportunityType: "",
        expRequired: "",
        location: "",
        noticePeriod: "",
        budget: "",
        ageing: "",
        accountManager: "",
        accountdirector: "",
        recruiterName: "",
        cvsShared: "",
        status: "",
      });

      fetchFunnelData();
      setView("table"); //  After submit, show table
    } catch (error) {
      console.error(" Error saving data:", error);
      alert("Failed to save data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- JSX ----------
  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      {/* ---------- Top Buttons ---------- */}
      <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
        <Button
          variant={view === "form" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setView("form")}
        >
           Create Form
        </Button>
        <Button
          variant={view === "table" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setView("table")}
        >
           View Submitted Data
        </Button>
      </Stack>

      {/* ---------- FORM SECTION ---------- */}
      {view === "form" && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfReceipt"
                label="Date of Requirement Receipt"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={formData.dateOfReceipt}
                onChange={handleChange}
              />
            </Grid>

            {/* Text Fields */}
            {[
              ["customerName", "Customer Name"],
              ["projectName", "Customer Project Name"],
              ["taSpoc", "Customer TA SPOC"],
              ["referenceNo", "Customer Reference No"],
              ["skill", "Skill"],
              ["expRequired", "Exp Required"],
              ["location", "Location of Deployment"],
              ["noticePeriod", "Notice Period"],
              ["accountdirector", "Account Director"],
              ["budget", "Budget"],
            ].map(([name, label]) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  name={name}
                  label={label}
                  fullWidth
                  value={formData[name as keyof RequirementFormData]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            {/* Number Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="countRequired"
                label="Count Required"
                type="number"
                fullWidth
                value={formData.countRequired}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="cvsShared"
                label="No of CVs Shared"
                type="number"
                fullWidth
                value={formData.cvsShared}
                onChange={handleChange}
              />
            </Grid>

            {/* Dropdowns */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="opportunityType"
                label="Opportunity Type"
                fullWidth
                value={formData.opportunityType}
                onChange={handleChange}
                select
              >
                <MenuItem value="FTE">FTE</MenuItem>
                <MenuItem value="T&M">T&amp;M</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="accountManager"
                label="Account Manager"
                fullWidth
                value={formData.accountManager}
                onChange={handleChange}
                select
              >
                <MenuItem value="Abeer">Abeer</MenuItem>
                <MenuItem value="Akhansha">Akhansha</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="recruiterName"
                label="Recruiter Name"
                fullWidth
                value={formData.recruiterName}
                onChange={handleChange}
                select
              >
                <MenuItem value="Suman">Suman</MenuItem>
                <MenuItem value="Ankur">Ankur</MenuItem>
                <MenuItem value="Manish">Manish</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                label="Status"
                fullWidth
                value={formData.status}
                onChange={handleChange}
                select
              >
                {[
                  "Need to Source Profiles",
                  "In Test Stage",
                  "L1 Round",
                  "L2 Round",
                  "C1 Round",
                  "C2 Round",
                  "C3 Round",
                  "HR Round",
                  "FTF Round",
                  "Lost",
                  "Deployed",
                  "On Hold",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit */}
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {/* ---------- TABLE SECTION ---------- */}
      {view === "table" && (
        <Box mt={4}>
          <h2> Your Submitted Funnel Data</h2>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Skill</TableCell>
                  <TableCell>Count</TableCell>
                  <TableCell>Opportunity</TableCell>
                  <TableCell>Exp</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Recruiter</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {funnelData && funnelData.length > 0 ? (
                  funnelData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.dateOfReceipt}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.projectName}</TableCell>
                      <TableCell>{row.skill}</TableCell>
                      <TableCell>{row.countRequired}</TableCell>
                      <TableCell>{row.opportunityType}</TableCell>
                      <TableCell>{row.expRequired}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.recruiterName}</TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default VizlogiccreateList;
