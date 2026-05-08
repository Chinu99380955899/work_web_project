import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Chip,
  FormHelperText,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { candidateApi, uploadApi } from "@/services/api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`upload-tabpanel-${index}`}
      aria-labelledby={`upload-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Validation schema for single candidate upload
const singleCandidateSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  jobTitle: Yup.string().required("Job title is required"),
  currentLocation: Yup.string(),
  preferredLocations: Yup.array().of(Yup.string()),
  totalExperience: Yup.number().min(0, "Experience must be positive"),
  currentCompanyName: Yup.string(),
  currentCompanyDesignation: Yup.string(),
  department: Yup.string(),
  role: Yup.string(),
  industry: Yup.string(),
  keySkills: Yup.array().of(Yup.string()),
  annualSalary: Yup.number().min(0, "Salary must be positive"),
  noticePeriod: Yup.string(),
  resumeHeadline: Yup.string(),
  summary: Yup.string(),
  ugDegree: Yup.string(),
  ugSpecialization: Yup.string(),
  ugUniversity: Yup.string(),
  ugGraduationYear: Yup.number().min(1900, "Invalid year"),
  pgDegree: Yup.string(),
  pgSpecialization: Yup.string(),
  pgUniversity: Yup.string(),
  pgGraduationYear: Yup.number().min(1900, "Invalid year"),
  doctorateeDegree: Yup.string(),
  doctorateSpecialization: Yup.string(),
  doctorateUniversity: Yup.string(),
  doctorateGraduationYear: Yup.number().min(1900, "Invalid year"),
  gender: Yup.string().oneOf(
    ["Male", "Female", "Other", "Prefer not to say"],
    "Invalid gender"
  ),
  maritalStatus: Yup.string().oneOf(
    ["Single", "Married", "Divorced", "Widowed", "Other"],
    "Invalid marital status"
  ),
  homeTown: Yup.string(),
  pinCode: Yup.string(),
  workPermitUSA: Yup.boolean(),
  dateOfBirth: Yup.date(),
  permanentAddress: Yup.string(),
  resumeUrl: Yup.string(),
});

export const UploadPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // const [uploadedResumes, setUploadedResumes] = useState<File[]>([]);
  // const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Single candidate form
  const singleForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      jobTitle: "",
      currentLocation: "",
      preferredLocations: [] as string[],
      totalExperience: "",
      currentCompanyName: "",
      currentCompanyDesignation: "",
      department: "",
      role: "",
      industry: "",
      keySkills: [] as string[],
      annualSalary: "",
      noticePeriod: "",
      resumeHeadline: "",
      summary: "",
      ugDegree: "",
      ugSpecialization: "",
      ugUniversity: "",
      ugGraduationYear: "",
      pgDegree: "",
      pgSpecialization: "",
      pgUniversity: "",
      pgGraduationYear: "",
      doctorateeDegree: "",
      doctorateSpecialization: "",
      doctorateUniversity: "",
      doctorateGraduationYear: "",
      gender: "" as "Male" | "Female" | "Other" | "Prefer not to say" | "",
      maritalStatus: "" as
        | "Single"
        | "Married"
        | "Divorced"
        | "Widowed"
        | "Other"
        | "",
      homeTown: "",
      pinCode: "",
      workPermitUSA: false,
      dateOfBirth: "",
      resumeUrl: "",
      permanentAddress: "",
    },
    validationSchema: singleCandidateSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setMessage(null);

        const candidateData = {
          ...values,
          totalExperience: values.totalExperience
            ? parseFloat(values.totalExperience)
            : undefined,
          annualSalary: values.annualSalary
            ? parseFloat(values.annualSalary)
            : undefined,
          ugGraduationYear: values.ugGraduationYear
            ? parseInt(values.ugGraduationYear)
            : undefined,
          pgGraduationYear: values.pgGraduationYear
            ? parseInt(values.pgGraduationYear)
            : undefined,
          doctorateGraduationYear: values.doctorateGraduationYear
            ? parseInt(values.doctorateGraduationYear)
            : undefined,
          dateOfBirth: values.dateOfBirth
            ? new Date(values.dateOfBirth)
            : undefined,
          gender:
            values.gender ||
            (undefined as
              | "Male"
              | "Female"
              | "Other"
              | "Prefer not to say"
              | undefined),
          maritalStatus:
            values.maritalStatus ||
            (undefined as
              | "Single"
              | "Married"
              | "Divorced"
              | "Widowed"
              | "Other"
              | undefined),
        };

        await candidateApi.uploadSingle(candidateData);

        setMessage({
          type: "success",
          text: "Candidate uploaded successfully!",
        });
        singleForm.resetForm();
      } catch (error: any) {
        setMessage({
          type: "error",
          text: error.message || "Failed to upload candidate",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Bulk upload dropzone for CSV
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   accept: {
  //     "text/csv": [".csv"],
  //     "application/vnd.ms-excel": [".xls"],
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
  //       ".xlsx",
  //     ],
  //   },
  //   maxFiles: 1,
  //   onDrop: (acceptedFiles) => {
  //     setUploadedFile(acceptedFiles[0]);
  //     setMessage(null);
  //   },
  // });

  // Resume files dropzone
  // const {
  //   getRootProps: getResumeRootProps,
  //   getInputProps: getResumeInputProps,
  //   isDragActive: isResumeDragActive,
  // } = useDropzone({
  //   accept: {
  //     "application/pdf": [".pdf"],
  //     "application/msword": [".doc"],
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
  //       [".docx"],
  //   },
  //   maxFiles: 50,
  //   onDrop: (acceptedFiles) => {
  //     setUploadedResumes(acceptedFiles);
  //     setMessage(null);
  //   },
  // });

  // const handleBulkUpload = async () => {
  //   if (!uploadedFile) {
  //     setMessage({ type: "error", text: "Please select a file to upload" });
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     setMessage(null);
  //     setUploadProgress(0);

  //     const formData = new FormData();
  //     formData.append("csv", uploadedFile);

  //     // Add resume files if any
  //     uploadedResumes.forEach((resume) => {
  //       formData.append("resumes", resume);
  //     });

  //     const response = await uploadApi.uploadBulkCandidates(
  //       formData,
  //       (progress) => {
  //         setUploadProgress(progress);
  //       }
  //     );

  //     setMessage({
  //       type: "success",
  //       text: `Bulk upload completed! ${
  //         response.data?.successful || 0
  //       } candidates uploaded successfully. ${
  //         response.data?.failed || 0
  //       } failed. ${
  //         uploadedResumes.length > 0
  //           ? ` ${uploadedResumes.length} resume files uploaded.`
  //           : ""
  //       }`,
  //     });
  //     setUploadedFile(null);
  //     setUploadedResumes([]);
  //     setUploadProgress(0);
  //   } catch (error: any) {
  //     setMessage({
  //       type: "error",
  //       text: error.message || "Failed to upload candidates",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setMessage(null);
  };
  const autoFillFromResume = (resumeData: any) => {
    console.log("Auto-filling form with data:", resumeData);

    if (resumeData.name) singleForm.setFieldValue("name", resumeData.name);
    if (resumeData.email) singleForm.setFieldValue("email", resumeData.email);
    if (resumeData.phone)
      singleForm.setFieldValue("phoneNumber", resumeData.phone);
    if (resumeData.location)
      singleForm.setFieldValue("currentLocation", resumeData.location);
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
      singleForm.setFieldValue("keySkills", resumeData.skills);
    }
    if (resumeData.experience)
      singleForm.setFieldValue("totalExperience", resumeData.experience);
    if (resumeData.currentCompany)
      singleForm.setFieldValue("currentCompanyName", resumeData.currentCompany);
    if (resumeData.currentTitle)
      singleForm.setFieldValue(
        "currentCompanyDesignation",
        resumeData.currentTitle
      );
    if (resumeData.summary)
      singleForm.setFieldValue("summary", resumeData.summary);

    // Handle education data
    if (resumeData.education) {
      const education = resumeData.education;
      if (education.ug) {
        if (education.ug.degree)
          singleForm.setFieldValue("ugDegree", education.ug.degree);
        if (education.ug.specialization)
          singleForm.setFieldValue(
            "ugSpecialization",
            education.ug.specialization
          );
        if (education.ug.university)
          singleForm.setFieldValue("ugUniversity", education.ug.university);
        if (education.ug.year)
          singleForm.setFieldValue("ugGraduationYear", education.ug.year);
      }
      if (education.pg) {
        if (education.pg.degree)
          singleForm.setFieldValue("pgDegree", education.pg.degree);
        if (education.pg.specialization)
          singleForm.setFieldValue(
            "pgSpecialization",
            education.pg.specialization
          );
        if (education.pg.university)
          singleForm.setFieldValue("pgUniversity", education.pg.university);
        if (education.pg.year)
          singleForm.setFieldValue("pgGraduationYear", education.pg.year);
      }
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      try {
        setError(null);
        setUploadSuccess(null);
        setIsUploading(true);
        const file = acceptedFiles[0];

        const response = await uploadApi.uploadResume(file);
        singleForm.setFieldValue("resumeUrl", response.data.fileUrl);

        setUploadSuccess(`Resume uploaded successfully: ${file.name}`);

        // Parse resume and extract information
        try {
          const parseResponse = await uploadApi.parseResume(file);
          if (parseResponse.data) {
            console.log("Resume parsing response:", parseResponse.data);
            autoFillFromResume(parseResponse.data.data);
            setUploadSuccess(
              `Resume uploaded and parsed successfully! Form fields have been auto-filled.`
            );
          }
        } catch (parseError: any) {
          console.warn("Resume parsing failed:", parseError);
          setUploadSuccess(
            `Resume uploaded successfully, but parsing failed. Please fill the form manually.`
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to upload resume");
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleArrayFieldChange = (field: string, value: string) => {
    const newValues = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    singleForm.setFieldValue(field, newValues);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Candidates
      </Typography>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="upload tabs"
        >
          <Tab
            icon={<PersonAddIcon />}
            label="Single Candidate"
            iconPosition="start"
          />
          <Tab
            icon={<CloudUploadIcon />}
            label="Bulk Upload"
            iconPosition="start"
          />
        </Tabs>

        {message && (
          <Alert
            severity={message.type}
            sx={{ m: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={singleForm.handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

          
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name *"
                  value={singleForm.values.name}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.name && Boolean(singleForm.errors.name)
                  }
                  helperText={singleForm.touched.name && singleForm.errors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email *"
                  type="email"
                  value={singleForm.values.email}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.email && Boolean(singleForm.errors.email)
                  }
                  helperText={
                    singleForm.touched.email && singleForm.errors.email
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number *"
                  value={singleForm.values.phoneNumber}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.phoneNumber &&
                    Boolean(singleForm.errors.phoneNumber)
                  }
                  helperText={
                    singleForm.touched.phoneNumber &&
                    singleForm.errors.phoneNumber
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="jobTitle"
                  label="Job Title"
                  value={singleForm.values.jobTitle}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.jobTitle &&
                    Boolean(singleForm.errors.jobTitle)
                  }
                  helperText={
                    singleForm.touched.jobTitle && singleForm.errors.jobTitle
                  }
                />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Professional Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="currentLocation"
                  label="Current Location"
                  value={singleForm.values.currentLocation}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.currentLocation &&
                    Boolean(singleForm.errors.currentLocation)
                  }
                  helperText={
                    singleForm.touched.currentLocation &&
                    singleForm.errors.currentLocation
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="totalExperience"
                  label="Total Experience (years)"
                  type="number"
                  value={singleForm.values.totalExperience}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.totalExperience &&
                    Boolean(singleForm.errors.totalExperience)
                  }
                  helperText={
                    singleForm.touched.totalExperience &&
                    singleForm.errors.totalExperience
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="currentCompanyName"
                  label="Current Company"
                  value={singleForm.values.currentCompanyName}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.currentCompanyName &&
                    Boolean(singleForm.errors.currentCompanyName)
                  }
                  helperText={
                    singleForm.touched.currentCompanyName &&
                    singleForm.errors.currentCompanyName
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="currentCompanyDesignation"
                  label="Current Designation"
                  value={singleForm.values.currentCompanyDesignation}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.currentCompanyDesignation &&
                    Boolean(singleForm.errors.currentCompanyDesignation)
                  }
                  helperText={
                    singleForm.touched.currentCompanyDesignation &&
                    singleForm.errors.currentCompanyDesignation
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="annualSalary"
                  label="Annual Salary"
                  type="number"
                  value={singleForm.values.annualSalary}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.annualSalary &&
                    Boolean(singleForm.errors.annualSalary)
                  }
                  helperText={
                    singleForm.touched.annualSalary &&
                    singleForm.errors.annualSalary
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="noticePeriod"
                  label="Notice Period"
                  value={singleForm.values.noticePeriod}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.noticePeriod &&
                    Boolean(singleForm.errors.noticePeriod)
                  }
                  helperText={
                    singleForm.touched.noticePeriod &&
                    singleForm.errors.noticePeriod
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="keySkills"
                  label="Key Skills (comma-separated)"
                  value={singleForm.values.keySkills.join(", ")}
                  onChange={(e) =>
                    handleArrayFieldChange("keySkills", e.target.value)
                  }
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.keySkills &&
                    Boolean(singleForm.errors.keySkills)
                  }
                  helperText={
                    singleForm.touched.keySkills && singleForm.errors.keySkills
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="summary"
                  label="Professional Summary"
                  value={singleForm.values.summary}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.summary &&
                    Boolean(singleForm.errors.summary)
                  }
                  helperText={
                    singleForm.touched.summary && singleForm.errors.summary
                  }
                />
              </Grid>

              {/* Education Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Education Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="ugDegree"
                  label="Undergraduate Degree"
                  value={singleForm.values.ugDegree}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.ugDegree &&
                    Boolean(singleForm.errors.ugDegree)
                  }
                  helperText={
                    singleForm.touched.ugDegree && singleForm.errors.ugDegree
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="ugUniversity"
                  label="Undergraduate University"
                  value={singleForm.values.ugUniversity}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.ugUniversity &&
                    Boolean(singleForm.errors.ugUniversity)
                  }
                  helperText={
                    singleForm.touched.ugUniversity &&
                    singleForm.errors.ugUniversity
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="ugGraduationYear"
                  label="UG Graduation Year"
                  type="number"
                  value={singleForm.values.ugGraduationYear}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.ugGraduationYear &&
                    Boolean(singleForm.errors.ugGraduationYear)
                  }
                  helperText={
                    singleForm.touched.ugGraduationYear &&
                    singleForm.errors.ugGraduationYear
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="pgDegree"
                  label="Postgraduate Degree"
                  value={singleForm.values.pgDegree}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.pgDegree &&
                    Boolean(singleForm.errors.pgDegree)
                  }
                  helperText={
                    singleForm.touched.pgDegree && singleForm.errors.pgDegree
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="pgSpecialization"
                  label="PG Specialization"
                  value={singleForm.values.pgSpecialization}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.pgSpecialization &&
                    Boolean(singleForm.errors.pgSpecialization)
                  }
                  helperText={
                    singleForm.touched.pgSpecialization &&
                    singleForm.errors.pgSpecialization
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="pgUniversity"
                  label="PG University"
                  value={singleForm.values.pgUniversity}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.pgUniversity &&
                    Boolean(singleForm.errors.pgUniversity)
                  }
                  helperText={
                    singleForm.touched.pgUniversity &&
                    singleForm.errors.pgUniversity
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="pgGraduationYear"
                  label="PG Graduation Year"
                  type="number"
                  value={singleForm.values.pgGraduationYear}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.pgGraduationYear &&
                    Boolean(singleForm.errors.pgGraduationYear)
                  }
                  helperText={
                    singleForm.touched.pgGraduationYear &&
                    singleForm.errors.pgGraduationYear
                  }
                />
              </Grid>

              {/* Doctorate Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Doctorate Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="doctorateeDegree"
                  label="Doctorate Degree"
                  value={singleForm.values.doctorateeDegree}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.doctorateeDegree &&
                    Boolean(singleForm.errors.doctorateeDegree)
                  }
                  helperText={
                    singleForm.touched.doctorateeDegree &&
                    singleForm.errors.doctorateeDegree
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="doctorateSpecialization"
                  label="Doctorate Specialization"
                  value={singleForm.values.doctorateSpecialization}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.doctorateSpecialization &&
                    Boolean(singleForm.errors.doctorateSpecialization)
                  }
                  helperText={
                    singleForm.touched.doctorateSpecialization &&
                    singleForm.errors.doctorateSpecialization
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="doctorateUniversity"
                  label="Doctorate University"
                  value={singleForm.values.doctorateUniversity}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.doctorateUniversity &&
                    Boolean(singleForm.errors.doctorateUniversity)
                  }
                  helperText={
                    singleForm.touched.doctorateUniversity &&
                    singleForm.errors.doctorateUniversity
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="doctorateGraduationYear"
                  label="Doctorate Graduation Year"
                  type="number"
                  value={singleForm.values.doctorateGraduationYear}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.doctorateGraduationYear &&
                    Boolean(singleForm.errors.doctorateGraduationYear)
                  }
                  helperText={
                    singleForm.touched.doctorateGraduationYear &&
                    singleForm.errors.doctorateGraduationYear
                  }
                />
              </Grid>

              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Personal Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={singleForm.values.gender}
                    onChange={singleForm.handleChange}
                    onBlur={singleForm.handleBlur}
                    error={
                      singleForm.touched.gender &&
                      Boolean(singleForm.errors.gender)
                    }
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    <MenuItem value="Prefer not to say">
                      Prefer not to say
                    </MenuItem>
                  </Select>
                  {singleForm.touched.gender && singleForm.errors.gender && (
                    <FormHelperText error>
                      {singleForm.errors.gender}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    name="maritalStatus"
                    value={singleForm.values.maritalStatus}
                    onChange={singleForm.handleChange}
                    onBlur={singleForm.handleBlur}
                    error={
                      singleForm.touched.maritalStatus &&
                      Boolean(singleForm.errors.maritalStatus)
                    }
                  >
                    <MenuItem value="">Select Marital Status</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                  {singleForm.touched.maritalStatus &&
                    singleForm.errors.maritalStatus && (
                      <FormHelperText error>
                        {singleForm.errors.maritalStatus}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="homeTown"
                  label="Home Town/City"
                  value={singleForm.values.homeTown}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.homeTown &&
                    Boolean(singleForm.errors.homeTown)
                  }
                  helperText={
                    singleForm.touched.homeTown && singleForm.errors.homeTown
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="pinCode"
                  label="PIN Code"
                  value={singleForm.values.pinCode}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.pinCode &&
                    Boolean(singleForm.errors.pinCode)
                  }
                  helperText={
                    singleForm.touched.pinCode && singleForm.errors.pinCode
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={singleForm.values.dateOfBirth}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.dateOfBirth &&
                    Boolean(singleForm.errors.dateOfBirth)
                  }
                  helperText={
                    singleForm.touched.dateOfBirth &&
                    singleForm.errors.dateOfBirth
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Work Permit for USA</InputLabel>
                  <Select
                    name="workPermitUSA"
                    value={singleForm.values.workPermitUSA.toString()}
                    onChange={(e) =>
                      singleForm.setFieldValue(
                        "workPermitUSA",
                        e.target.value === "true"
                      )
                    }
                    onBlur={singleForm.handleBlur}
                    error={
                      singleForm.touched.workPermitUSA &&
                      Boolean(singleForm.errors.workPermitUSA)
                    }
                  >
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </Select>
                  {singleForm.touched.workPermitUSA &&
                    singleForm.errors.workPermitUSA && (
                      <FormHelperText error>
                        {singleForm.errors.workPermitUSA}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
               <Grid item xs={12}>
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed #ccc",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    opacity: isUploading ? 0.6 : 1,
                    "&:hover": {
                      borderColor: isUploading ? "#ccc" : "primary.main",
                    },
                  }}
                >
                  <input {...getInputProps()} disabled={isUploading} />
                  {isUploading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CircularProgress size={24} />
                      <Typography>Uploading and parsing resume...</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Please wait while we extract information from your
                        resume
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Typography>
                        Drag and drop your resume here, or click to select file
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Supported formats: PDF, DOC, DOCX
                      </Typography>
                      {singleForm.values.resumeUrl && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: "success.light",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="success.contrastText"
                          >
                            ✓ Resume uploaded successfully
                          </Typography>
                          <Typography
                            variant="caption"
                            color="success.contrastText"
                          >
                            Form fields will be auto-filled with extracted
                            information
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="permanentAddress"
                  label="Permanent Address"
                  value={singleForm.values.permanentAddress}
                  onChange={singleForm.handleChange}
                  onBlur={singleForm.handleBlur}
                  error={
                    singleForm.touched.permanentAddress &&
                    Boolean(singleForm.errors.permanentAddress)
                  }
                  helperText={
                    singleForm.touched.permanentAddress &&
                    singleForm.errors.permanentAddress
                  }
                />

                {/* <Box
                {...getResumeRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: isResumeDragActive ? "primary.main" : "grey.300",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isResumeDragActive
                    ? "action.hover"
                    : "background.paper",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
              
            </Box> */}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                    >
                      {isLoading ? "Uploading..." : "Upload Candidate"}
                    </Button>
                    {uploadSuccess && (
        <Alert severity="success" sx={{ m: 2 }}>
          {uploadSuccess}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Bulk Upload Candidates
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
              Upload a CSV file with candidate information. The file should
              include headers matching our standard format.
            </Typography> 

            {/* <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : "grey.300",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive
                  ? "action.hover"
                  : "background.paper",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {isDragActive
                  ? "Drop the file here"
                  : "Drag & drop a CSV file here"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                or click to select a file
              </Typography>
              {uploadedFile && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={uploadedFile.name}
                    onDelete={() => setUploadedFile(null)}
                    color="primary"
                  />
                </Box>
              )}
            </Box>

            {/* Resume Files Dropzone */}
            {/* <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resume Files (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Upload resume files that correspond to candidates in your CSV.
                The filename (without extension) should match the "Resume File"
                column in your CSV. For example, if your CSV has "resume1.pdf"
                in the Resume File column, upload a file named "resume1.pdf",
                "resume1.doc", or "resume1.docx".
              </Typography>

              <Box
                {...getResumeRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: isResumeDragActive ? "primary.main" : "grey.300",
                  borderRadius: 2,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isResumeDragActive
                    ? "action.hover"
                    : "background.paper",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <input {...getResumeInputProps()} />
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {isResumeDragActive
                    ? "Drop resume files here"
                    : "Drag & drop resume files here"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to select files (PDF, DOC, DOCX)
                </Typography>
                {uploadedResumes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Selected files:
                    </Typography>
                    {uploadedResumes.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => {
                          const newFiles = uploadedResumes.filter(
                            (_, i) => i !== index
                          );
                          setUploadedResumes(newFiles);
                        }}
                        color="primary"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box> */}

            {/* {uploadProgress > 0 && uploadProgress < 100 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Upload Progress: {uploadProgress}%
                </Typography>
                <Box
                  sx={{ width: "100%", bgcolor: "grey.200", borderRadius: 1 }}
                >
                  <Box
                    sx={{
                      width: `${uploadProgress}%`,
                      height: 8,
                      bgcolor: "primary.main",
                      borderRadius: 1,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>
            )} */}

            {/* <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBulkUpload}
                disabled={!uploadedFile || isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
              >
                {isLoading ? "Uploading..." : "Upload Candidates"}
              </Button>
            </Box> */}

            {/* <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                CSV Format Requirements
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Your CSV file should include the following columns (headers are
                case-sensitive):
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <li>Name, Email ID, Phone Number (required)</li>
                <li>Job Title, Current Location, Total Experience</li>
                <li>Curr. Company name, Curr. Company Designation</li>
                <li>Department, Role, Industry, Key Skills</li>
                <li>Annual Salary, Notice period/ Availability to join</li>
                <li>Resume Headline, Summary</li>
                <li>Education details (UG, PG, Doctorate)</li>
                <li>Personal information (Gender, Marital Status, etc.)</li>
                <li>
                  Resume File (optional) - filename without extension that
                  matches uploaded resume files
                </li>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const csvContent = `Name,Email ID,Phone Number,Job Title,Current Location,Total Experience,Curr. Company name,Curr. Company Designation,Department,Role,Industry,Key Skills,Annual Salary,Notice period/ Availability to join,Resume Headline,Summary,Under Graduation degree,UG Specialization,UG University/institute Name,UG Graduation year,Post graduation degree,PG specialization,PG university/institute name,PG graduation year,Doctorate degree,Doctorate specialization,Doctorate university/institute name,Doctorate graduation year,Gender,Marital Status,Home Town/City,Pin Code,Work permit for USA,Date of Birth,Permanent Address,Resume File
John Doe,john.doe@email.com,9899115728,Software Engineer,New York,5,ABC Corp,Senior Developer,Engineering,Full Stack,Technology,"JavaScript, React, Node.js",80000,30 days,Experienced Full Stack Developer,"Experienced software engineer with 5 years of experience in web development",Bachelor of Science,Computer Science,University of Technology,2018,Master of Science,Software Engineering,University of Technology,2020,,,,Male,Single,New York,10001,Yes,1995-01-15,"123 Main St, New York, NY 10001",resume1.pdf
Jane Smith,jane.smith@email.com,9899115720,Product Manager,San Francisco,7,XYZ Inc,Senior PM,Product,Product Management,Technology,"Product Strategy, Agile, User Research",120000,60 days,Senior Product Manager,"Product manager with 7 years of experience in B2B SaaS",Bachelor of Arts,Business Administration,State University,2016,Master of Business Administration,Business Administration,State University,2018,,,,Female,Married,San Francisco,94102,No,1993-05-20,"456 Oak Ave, San Francisco, CA 94102",resume2.docx`;

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "candidate_template.csv";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                >
                  Download CSV Template
                </Button>
              </Box>
            </Box> */}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};
