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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { trackerApi } from '@/services/api';
import { Tracker, TrackerField } from '@/types';

interface TrackerFormData {
  name: string;
  description?: string;
  companyName?: string;
  fields: TrackerField[];
}

const defaultFields: TrackerField[] = [
  { candidateField: 'name', displayName: 'Name', order: 1, isRequired: true },
  { candidateField: 'email', displayName: 'Email', order: 2, isRequired: true },
  { candidateField: 'phoneNumber', displayName: 'Phone Number', order: 3, isRequired: true },
];

export const TrackerManager: React.FC = () => {
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
  const [formData, setFormData] = useState<TrackerFormData>({
    name: '',
    description: '',
    companyName: '',
    fields: [...defaultFields],
  });

  useEffect(() => {
    fetchTrackers();
  }, []);

  const fetchTrackers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await trackerApi.getAll();
      if (response.data) {
        setTrackers(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trackers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (tracker?: Tracker) => {
    if (tracker) {
      setEditingTracker(tracker);
      setFormData({
        name: tracker.name,
        description: tracker.description,
        companyName: tracker.companyName,
        fields: [...tracker.fields],
      });
    } else {
      setEditingTracker(null);
      setFormData({
        name: '',
        description: '',
        companyName: '',
        fields: [...defaultFields],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTracker(null);
    setFormData({
      name: '',
      description: '',
      companyName: '',
      fields: [...defaultFields],
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingTracker) {
        await trackerApi.update(editingTracker._id, formData);
      } else {
        await trackerApi.create(formData);
      }

      await fetchTrackers();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to save tracker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tracker: Tracker) => {
    if (!window.confirm('Are you sure you want to delete this tracker?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await trackerApi.delete(tracker._id);
      await fetchTrackers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete tracker');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          candidateField: '',
          displayName: '',
          order: prev.fields.length + 1,
          isRequired: false,
        },
      ],
    }));
  };

  const handleRemoveField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleFieldChange = (index: number, field: Partial<TrackerField>) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === index ? { ...f, ...field } : f
      ),
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const fields = Array.from(formData.fields);
    const [removed] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, removed);

    // Update order
    const reorderedFields = fields.map((field, index) => ({
      ...field,
      order: index + 1,
    }));

    setFormData((prev) => ({
      ...prev,
      fields: reorderedFields,
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Export Trackers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Tracker
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
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Fields</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Last Used</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackers.map((tracker) => (
              <TableRow key={tracker._id}>
                <TableCell>{tracker.name}</TableCell>
                <TableCell>{tracker.companyName}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {tracker.fields.slice(0, 3).map((field) => (
                      <Chip
                        key={field.candidateField}
                        label={field.displayName}
                        size="small"
                      />
                    ))}
                    {tracker.fields.length > 3 && (
                      <Chip
                        label={`+${tracker.fields.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{tracker.usageCount}</TableCell>
                <TableCell>
                  {tracker.lastUsed
                    ? new Date(tracker.lastUsed).toLocaleDateString()
                    : 'Never'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(tracker)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(tracker)}
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTracker ? 'Edit Tracker' : 'Create Tracker'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tracker Name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Fields
              </Typography>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="fields">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {formData.fields.map((field, index) => (
                        <Draggable
                          key={index}
                          draggableId={`field-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              sx={{ p: 2, mb: 2 }}
                            >
                              <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                  <div {...provided.dragHandleProps}>
                                    <DragIndicatorIcon />
                                  </div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    label="Candidate Field"
                                    value={field.candidateField}
                                    onChange={(e) =>
                                      handleFieldChange(index, {
                                        candidateField: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    label="Display Name"
                                    value={field.displayName}
                                    onChange={(e) =>
                                      handleFieldChange(index, {
                                        displayName: e.target.value,
                                      })
                                    }
                                    required
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveField(index)}
                                    disabled={index < 3} // Prevent removing required fields
                                  >
                                    Remove
                                  </Button>
                                </Grid>
                              </Grid>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddField}
                sx={{ mt: 2 }}
              >
                Add Field
              </Button>
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