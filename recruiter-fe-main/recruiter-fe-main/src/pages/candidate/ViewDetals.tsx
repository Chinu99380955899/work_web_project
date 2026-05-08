import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";

interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  skills?: string;
  description?: string;
}

interface ViewDetailsProps {
  open: boolean;
  onClose: () => void;
  job: Job | null;
}

const ViewDetals: React.FC<ViewDetailsProps> = ({ open, onClose, job }) => {
  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{job.jobTitle}</DialogTitle>
      <DialogContent dividers>
        <Typography>
          <b>Company:</b> {job.companyName}
        </Typography>
        <Typography>
          <b>Location:</b> {job.location || "Not specified"}
        </Typography>
        <Typography>
          <b>Skills:</b> {job.skills || "Not mentioned"}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          {job.description || "No job description provided."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDetals;
