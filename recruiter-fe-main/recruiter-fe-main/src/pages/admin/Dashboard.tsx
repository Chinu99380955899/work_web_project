import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { adminApi } from "@/services/api";
import { SystemStats } from "@/types";

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 1,
            p: 1,
            mr: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { color },
          })}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value.toLocaleString()}
      </Typography>
    </CardContent>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getStats();
      if (response.data?.stats) {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.users.total || 0}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Active Recruiters"
            value={stats?.users.recruiters || 0}
            icon={<PersonAddIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Active Users"
            value={stats?.activity.activeUsers || 0}
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Verified Users"
            value={stats?.activity.verifiedUsers || 0}
            icon={<AssessmentIcon />}
            color="#9c27b0"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Manage Recruiters
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add, edit, or remove recruiter accounts and manage their
                      permissions.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate("/admin/recruiters")}
                    >
                      Go to Recruiters
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Search Candidates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Search and filter candidates based on various criteria.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate("/admin/search")}>
                      Search Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Export Trackers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage custom export formats for different companies.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate("/admin/trackers")}>
                      Manage Trackers
                    </Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure system-wide settings and preferences.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate("/admin/settings")}>
                      Go to Settings
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Funnel
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
     
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate("/admin/funneldata")}>
                      Go to Settings
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
               <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                    Sales Funnel 
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
     
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate("/admin/salesfunnelnew")}>
                      Go to Settings
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
