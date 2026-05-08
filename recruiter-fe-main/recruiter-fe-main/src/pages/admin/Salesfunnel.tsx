import React, { useEffect, useState } from "react";
import { salesFunnelApi } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

interface SalesFunnelType {
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
  createdBy?: string;
}

const Salesfunnel: React.FC = () => {
  const [data, setData] = useState<SalesFunnelType[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Sales Funnel Data
  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ Call API
      const response = await salesFunnelApi.getAll();

      // ✅ Extract data safely and correctly typed
      const allFunnels = response.data.data || [];

      console.log("✅ Sales Funnel Data:", allFunnels);

      setData(allFunnels);
    } catch (error) {
      console.error("❌ Error fetching sales funnel data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once on mount
  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <CircularProgress sx={{ mt: 5, mx: "auto", display: "block" }} />;

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        All Sales Funnels
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 1400, mx: "auto", mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date of Funnel Generation</TableCell>
              <TableCell>Account Manager</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Opportunity Type</TableCell>
              <TableCell>Opportunity Description</TableCell>
              <TableCell>Approximate Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expected Closure Month</TableCell>
              <TableCell>Projected Revenue</TableCell>
              {/* <TableCell>Created By</TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {new Date(item.dateOfFunnelGeneration).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.accountManager}</TableCell>
                  <TableCell>{item.lead}</TableCell>
                  <TableCell>{item.customerName}</TableCell>
                  <TableCell>{item.projectName}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.opportunityType}</TableCell>
                  <TableCell>{item.opportunityDescription}</TableCell>
                  <TableCell>{item.approximateValue}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.expectedClosureMonth}</TableCell>
                  <TableCell>{item.projectedRevenue}</TableCell>
                  {/* <TableCell>{item.createdBy}</TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Salesfunnel;
