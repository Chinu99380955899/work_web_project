import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { LoginForm } from "@/components/auth/LoginForm";

// Admin pages
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { RecruitersPage } from "@/pages/admin/Recruiters";
import Salesfunnel from "@/pages/admin/Salesfunnel"
// Recruiter pages
import { RecruiterDashboard } from "@/pages/recruiter/Dashboard";
import { SearchPage } from "@/pages/recruiter/Search";
import { TrackersPage } from "@/pages/recruiter/Trackers";
import { UploadPage } from "@/pages/recruiter/Upload";

// Candidate pages
import { CandidateProfile } from "@/pages/candidate/Profile";
import VizlogiccreateList from "@/components/recruiter/VizlogiccreateList";
import FunnelData from "@/pages/admin/FunnelData";
import Job from "@/pages/candidate/Job";
import JobPost from "@/pages/recruiter/JobPost";
import SalesFunnel from "@/components/recruiter/salesfunnel/SalesFunnel";


export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginForm />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="recruiters" element={<RecruitersPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="vizlogiclist" element={<VizlogiccreateList />} />
        <Route path="funneldata" element={<FunnelData />} />
        <Route path="salesfunnelnew" element={<Salesfunnel/>} />
      </Route >

      {/* Recruiter routes */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute roles={["recruiter"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="trackers" element={<TrackersPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="vizlogiclist" element={<VizlogiccreateList />} />
        <Route path="jobpost" element={<JobPost />} />
        <Route path="salesfunnel" element={<SalesFunnel/>} />
        <Route path="funneldata" element={<FunnelData />} />

      </Route>

      {/* Candidate routes */}
      <Route
        path="/candidate"
        element={
          <ProtectedRoute roles={["candidate"]}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/candidate/profile" replace />} />
        <Route path="profile" element={<CandidateProfile />} />
        <Route path="job" element={<Job />} />
      </Route>

      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />


    </Routes>
  );
};
