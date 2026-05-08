import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { TrackerManager } from '@/components/recruiter/TrackerManager';

export const TrackersPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Export Trackers
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <TrackerManager />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 