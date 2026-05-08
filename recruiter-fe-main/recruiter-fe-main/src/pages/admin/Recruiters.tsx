import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { RecruiterManager } from '@/components/admin/RecruiterManager';

export const RecruitersPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Recruiters
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <RecruiterManager />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 