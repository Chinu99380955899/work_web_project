import React, { useEffect, useState } from "react";
import { funnelApi } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
  Box,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; // ✅ FIXED

interface FunnelDataType {
  dateOfReceipt: string;
  customerName: string;
  projectName: string;
  taSpoc: string;
  referenceNo: string;
  skill: string;
  countRequired: number;
  opportunityType: string;
  expRequired: string;
  location: string;
  noticePeriod: string;
  budget: string;
  ageing: string;
  accountManager: string;
  accountdirector: string;
  recruiterName: string;
  cvsShared: number;
  status: string;
}

const FunnelData: React.FC = () => {
  const [data, setData] = useState<FunnelDataType[]>([]);
  const [filteredData, setFilteredData] = useState<FunnelDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    customer: "",
    project: "",
    skill: "",
    location: "",
    recruiter: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await funnelApi.getAll();
      const result: FunnelDataType[] = res?.data ?? []; // ✅ FIXED
      setData(result);
      setFilteredData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    const filtered = data.filter((item) => {
      return (
        (filters.customer === "" ||
          item.customerName
            .toLowerCase()
            .includes(filters.customer.toLowerCase())) &&
        (filters.project === "" ||
          item.projectName
            .toLowerCase()
            .includes(filters.project.toLowerCase())) &&
        (filters.skill === "" ||
          item.skill.toLowerCase().includes(filters.skill.toLowerCase())) &&
        (filters.location === "" ||
          item.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.recruiter === "" ||
          item.recruiterName
            .toLowerCase()
            .includes(filters.recruiter.toLowerCase()))
      );
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setFilters({
      customer: "",
      project: "",
      skill: "",
      location: "",
      recruiter: "",
    });
    setFilteredData(data);
  };

  // ✅ Download Excel
  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FunnelData");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "FunnelData.xlsx");
  };

  if (loading)
    return <CircularProgress sx={{ mt: 5, mx: "auto", display: "block" }} />;

  return (
    <>
      {/* Search fields */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          mt: 3,
          gap: 2,
        }}
      >
        <TextField
          label="Customer"
          value={filters.customer}
          onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
          size="small"
        />
        <TextField
          label="Project"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
          size="small"
        />
        <TextField
          label="Skill"
          value={filters.skill}
          onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
          size="small"
        />
        <TextField
          label="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          size="small"
        />
        <TextField
          label="Recruiter"
          value={filters.recruiter}
          onChange={(e) => setFilters({ ...filters, recruiter: e.target.value })}
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" color="success" onClick={handleDownload}>
          Download Excel
        </Button>
      </Box>

      {/* Data Table */}
      <TableContainer
        component={Paper}
        sx={{ maxWidth: 1200, mx: "auto", mt: 5 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date of Requirement Receipt</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Customer Project Name</TableCell>
              <TableCell>Customer TA SPOC</TableCell>
              <TableCell>Customer Reference No</TableCell>
              <TableCell>Skill</TableCell>
              <TableCell>Count Required</TableCell>
              <TableCell>Opportunity Type</TableCell>
              <TableCell>Exp Required</TableCell>
              <TableCell>Location of Deployment</TableCell>
              <TableCell>Notice Period</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Ageing</TableCell>
              <TableCell>Account Manager</TableCell>
              <TableCell>Recruiter Name</TableCell>
              <TableCell>No of CVs Shared</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={17} align="center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => {
                const receiptDate = new Date(item.dateOfReceipt);
                const today = new Date();
                const ageing = Math.floor(
                  (today.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <TableRow key={index}>
                    <TableCell>{receiptDate.toLocaleDateString()}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.projectName}</TableCell>
                    <TableCell>{item.taSpoc}</TableCell>
                    <TableCell>{item.referenceNo}</TableCell>
                    <TableCell>{item.skill}</TableCell>
                    <TableCell>{item.countRequired}</TableCell>
                    <TableCell>{item.opportunityType}</TableCell>
                    <TableCell>{item.expRequired} years</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.noticePeriod} days</TableCell>
                    <TableCell>{item.budget} LPA</TableCell>
                    <TableCell>{ageing} days</TableCell>
                    <TableCell>{item.accountManager}</TableCell>
                    <TableCell>{item.recruiterName}</TableCell>
                    <TableCell>{item.cvsShared}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FunnelData;
