import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { CandidateSearch } from "@/components/recruiter/CandidateSearch";

export const SearchPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Search Candidates
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <CandidateSearch />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
