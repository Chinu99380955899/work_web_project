import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { candidateApi } from '@/services/api';
import { Candidate, SearchFilters } from '@/types';

const experienceRanges = [
  '0-2',
  '2-5',
  '5-8',
  '8-12',
  '12-15',
  '15+',
];

const salaryRanges = [
  '0-3',
  '3-6',
  '6-10',
  '10-15',
  '15-25',
  '25+',
];

export const CandidateSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    role: '',
    skills: [],
    experience: '',
    salary: '',
    page: 1,
    limit: 10,
  });

  const [results, setResults] = useState<{
    candidates: Candidate[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await candidateApi.search(filters);
      if (response.data) {
        setResults(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput && !filters.skills?.includes(skillInput)) {
      setFilters((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill),
    }));
  };

  const handlePageChange = (_event: unknown, page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Candidates
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              InputProps={{
                endAdornment: <LocationIcon color="action" />,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Role"
              value={filters.role}
              onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
              InputProps={{
                endAdornment: <WorkIcon color="action" />,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Experience (Years)"
              value={filters.experience}
              onChange={(e) => setFilters((prev) => ({ ...prev, experience: e.target.value }))}
            >
              {experienceRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  {range} years
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Annual Salary (LPA)"
              value={filters.salary}
              onChange={(e) => setFilters((prev) => ({ ...prev, salary: e.target.value }))}
            >
              {salaryRanges.map((range) => (
                <MenuItem key={range} value={range}>
                  ₹{range} LPA
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                disabled={!skillInput}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.skills?.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results?.candidates.map((candidate) => (
        <Card key={candidate._id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6">
                  {candidate.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {candidate.jobTitle} at {candidate.currentCompanyName}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {candidate.currentLocation}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {candidate.totalExperience} years
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {candidate.ugDegree}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  {candidate.keySkills?.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="textSecondary">
                  Applied on: {formatDate(candidate.dateOfApplication)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => window.open(`mailto:${candidate.email}`)}
                  >
                    <EmailIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => window.open(`tel:${candidate.phoneNumber}`)}
                  >
                    <PhoneIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => window.open(candidate.resumeUrl)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </CardActions>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {results && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={results.pagination.pages}
            page={results.pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}; 