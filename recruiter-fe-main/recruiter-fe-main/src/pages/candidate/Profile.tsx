import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { CandidateForm } from '@/components/candidate/CandidateForm';
import { candidateApi } from '@/services/api';
import { Candidate } from '@/types';

export const CandidateProfile: React.FC = () => {
  const [profile, setProfile] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await candidateApi.getProfile();
      console.log('Profile response:', response);
      if (response.data?.candidate) {
        setProfile(response.data.candidate);
        setHasProfile(true);
      } else {
        setError('No profile data received');
      }
    } catch (err: any) {
      // If profile not found, it means the candidate needs to create one
      if (err.message?.includes('not found') || err.response?.data?.message?.includes('not found')) {
        setProfile(null);
        setHasProfile(false);
        setError(null);
      } else {
        setError(err.message || 'Failed to fetch profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStepChange = (step: number) => {
    setTabValue(step);
  };

  const handleSave = async () => {
    await fetchProfile();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error only if it's not a "profile not found" case
  if (error && hasProfile) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {hasProfile ? 'My Profile' : 'Create Profile'}
      </Typography>

      {!hasProfile && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Welcome! Please create your candidate profile to get started.
        </Alert>
      )}

      <Paper>
        {hasProfile && (
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Basic Information" />
            <Tab label="Professional Details" />
            <Tab label="Education" />
            <Tab label="Personal Details" />
          </Tabs>
        )}

        <Box sx={{ p: 3 }}>
          <CandidateForm
            initialData={profile}
            activeStep={hasProfile ? tabValue : 0}
            onStepChange={handleStepChange}
            onSave={handleSave}
            isEdit={hasProfile}
          />
        </Box>
      </Paper>
    </Box>
  );
}; 