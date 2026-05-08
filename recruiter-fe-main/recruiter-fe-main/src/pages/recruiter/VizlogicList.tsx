import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import VizlogiccreateList from '@/components/recruiter/VizlogiccreateList';

export const ResourcingPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
         Vizlogic datalist
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <VizlogiccreateList/>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 