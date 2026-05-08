import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { salesFunnelApi } from "@/services/api";
import jwt_decode from "jwt-decode";

interface SalesFunnelForm {
  dateOfFunnelGeneration: string;
  accountManager: string;
  lead: string;
  customerName: string;
  projectName: string;
  location: string;
  opportunityType: string;
  opportunityDescription: string;
  approximateValue: string | number;
  status: string;
  expectedClosureMonth: string;
  projectedRevenue: string | number;
  createdBy?: string;
}

interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

interface ApiResponse<T> {
  success: boolean;
  count: number;
  data: T;
  message?: string;
}

const SalesFunnel: React.FC = () => {
  const [formData, setFormData] = useState<SalesFunnelForm>({
    dateOfFunnelGeneration: "",
    accountManager: "",
    lead: "",
    customerName: "",
    projectName: "",
    location: "",
    opportunityType: "",
    opportunityDescription: "",
    approximateValue: "",
    status: "",
    expectedClosureMonth: "",
    projectedRevenue: "",
  });

  const [userId, setUserId] = useState<string>("");
  const [funnelData, setFunnelData] = useState<SalesFunnelForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"form" | "table">("form"); // 👈 Toggle view state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: TokenPayload = jwt_decode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error(" Error decoding token:", err);
      }
    }
  }, []);

  const fetchFunnelData = async () => {
    if (!userId) return;
    try {
      const response = (await salesFunnelApi.getAll()) as {
        data: ApiResponse<SalesFunnelForm[]>;
      };
      const allFunnels = response.data.data || [];
      const userFunnels = allFunnels.filter(
        (f: SalesFunnelForm) => f.createdBy === userId
      );
      setFunnelData(userFunnels);
    } catch (error) {
      console.error(" Error fetching funnels:", error);
      setFunnelData([]);
    }
  };

  useEffect(() => {
    if (userId && view === "table") fetchFunnelData();
  }, [userId, view]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        createdBy: userId,
        approximateValue: parseFloat(formData.approximateValue as string) || 0,
        projectedRevenue: parseFloat(formData.projectedRevenue as string) || 0,
      };

      if (!formData.customerName || !formData.projectName || !formData.status) {
        alert(" Please fill in required fields: Customer Name, Project Name, and Status.");
        setLoading(false);
        return;
      }

      await salesFunnelApi.create(payload);
      alert("Sales Funnel saved successfully!");

      setFormData({
        dateOfFunnelGeneration: "",
        accountManager: "",
        lead: "",
        customerName: "",
        projectName: "",
        location: "",
        opportunityType: "",
        opportunityDescription: "",
        approximateValue: "",
        status: "",
        expectedClosureMonth: "",
        projectedRevenue: "",
      });

      setView("table"); //  Auto switch to table after submit
      fetchFunnelData();
    } catch (error: any) {
      console.error(" Error saving funnel:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error saving data!";
      alert(` ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={1200} mx="auto">
      <Typography variant="h5" gutterBottom>
         Sales Funnel Dashboard
      </Typography>

      {/*  TOGGLE BUTTONS  */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant={view === "form" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setView("form")}
        >
           Create Funnel
        </Button>
        <Button
          variant={view === "table" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setView("table")}
        >
           View Submitted Funnels
        </Button>
      </Box>

      {/*  CONDITIONAL RENDER */}
      {view === "form" ? (
        <>
          <Typography variant="h6" gutterBottom>
             Sales Funnel Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { name: "dateOfFunnelGeneration", label: "Date of Funnel Generation", type: "date" },
                { name: "accountManager", label: "Account Manager" },
                { name: "lead", label: "Lead" },
                { name: "customerName", label: "Customer Name", required: true },
                { name: "projectName", label: "Project Name", required: true },
                { name: "location", label: "Location" },
                { name: "opportunityType", label: "Opportunity Type" },
                { name: "opportunityDescription", label: "Opportunity Description" },
                { name: "approximateValue", label: "Approximate Value (Lakhs)", type: "number" },
                { name: "status", label: "Status", required: true },
                { name: "expectedClosureMonth", label: "Expected Closure Month", type: "month" },
                { name: "projectedRevenue", label: "Projected Revenue (FY 25-26)", type: "number" },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name as keyof SalesFunnelForm]}
                    onChange={handleChange}
                    required={field.required}
                    InputLabelProps={
                      field.type === "date" || field.type === "month"
                        ? { shrink: true }
                        : undefined
                    }
                    inputProps={
                      field.type === "number"
                        ? { step: "0.01", min: "0" }
                        : undefined
                    }
                  />
                </Grid>
              ))}
            </Grid>

            <Box mt={3} textAlign="right">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit Funnel"}
              </Button>
            </Box>
          </form>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            📋 Your Submitted Funnels
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Account Manager</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Lead</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Opportunity Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Closure Month</TableCell>
                  <TableCell>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {funnelData.length > 0 ? (
                  funnelData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.dateOfFunnelGeneration}</TableCell>
                      <TableCell>{row.accountManager}</TableCell>
                      <TableCell>{row.projectName}</TableCell>
                      <TableCell>{row.lead}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.opportunityType}</TableCell>
                      <TableCell>{row.opportunityDescription}</TableCell>
                      <TableCell>{row.approximateValue}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.expectedClosureMonth}</TableCell>
                      <TableCell>{row.projectedRevenue}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default SalesFunnel;
