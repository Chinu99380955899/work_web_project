import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { adminApi } from '@/services/api';
import { User } from '@/types';

const permissions = [
  { value: 'bulk_upload', label: 'Bulk Upload' },
  { value: 'single_upload', label: 'Single Upload' },
  { value: 'export', label: 'Export' },
  { value: 'search', label: 'Search' },
  { value: 'manage_trackers', label: 'Manage Trackers' },
  { value: 'funnel_data', label: 'Funnel_Data' },
{ value: 'sales_funnel_data', label: 'Sales_Funnel_Data' },
{ value: 'job_post', label: 'Job_Post' },
];

interface RecruiterFormData {
  phoneNumber: string;
  email: string;
  permissions: string[];
}

export const RecruiterManager: React.FC = () => {
  const [recruiters, setRecruiters] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<User | null>(null);
  const [formData, setFormData] = useState<RecruiterFormData>({
    phoneNumber: '',
    email: '',
    permissions: ['search'],
  });

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getRecruiters();
      if (response.data?.recruiters) {
        setRecruiters(response.data.recruiters);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch recruiters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (recruiter?: User) => {
    if (recruiter) {
      setEditingRecruiter(recruiter);
      setFormData({
        phoneNumber: recruiter.phoneNumber,
        email: recruiter.email || '',
        permissions: recruiter.permissions || [],
      });
    } else {
      setEditingRecruiter(null);
      setFormData({
        phoneNumber: '',
        email: '',
        permissions: ['search'],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRecruiter(null);
    setFormData({
      phoneNumber: '',
      email: '',
      permissions: ['search'],
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingRecruiter && editingRecruiter._id) {
        await adminApi.updateRecruiter(editingRecruiter._id, {
          permissions: formData.permissions,
        });
      } else {
        await adminApi.createRecruiter(formData);
      }

      await fetchRecruiters();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to save recruiter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (recruiter: User) => {
    if (!window.confirm('Are you sure you want to delete this recruiter?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await adminApi.deleteRecruiter(recruiter?._id || '');
      await fetchRecruiters();
    } catch (err: any) {
      setError(err.message || 'Failed to delete recruiter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermission = (permission: string) => {
    setFormData((prev) => {
      const permissions = prev.permissions || [];
      const newPermissions = permissions.includes(permission)
        ? permissions.filter((p) => p !== permission)
        : [...permissions, permission];

      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Manage Recruiters
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Recruiter
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recruiters.map((recruiter) => (
              <TableRow key={recruiter._id}>
                <TableCell>{recruiter.phoneNumber}</TableCell>
                <TableCell>{recruiter.email}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {recruiter.permissions?.map((permission) => (
                      <Chip
                        key={permission}
                        label={permissions.find((p) => p.value === permission)?.label || permission}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={recruiter.isActive ? 'Active' : 'Inactive'}
                    color={recruiter.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {recruiter.lastLogin
                    ? new Date(recruiter.lastLogin).toLocaleDateString()
                    : 'Never'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(recruiter)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(recruiter)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingRecruiter ? 'Edit Recruiter' : 'Add Recruiter'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {!editingRecruiter && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    required
                    placeholder="+91XXXXXXXXXX"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Permissions
              </Typography>
              <Grid container spacing={1}>
                {permissions.map((permission) => (
                  <Grid item xs={12} sm={6} key={permission.value}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.permissions.includes(permission.value)}
                          onChange={() => handleTogglePermission(permission.value)}
                        />
                      }
                      label={permission.label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 