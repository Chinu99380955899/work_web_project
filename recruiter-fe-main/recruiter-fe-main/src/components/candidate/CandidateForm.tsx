import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Chip,
  Autocomplete,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { candidateApi, uploadApi } from "@/services/api";
import { Candidate } from "@/types";

interface CandidateFormProps {
  initialData?: Candidate | null;
  activeStep?: number;
  onStepChange?: (step: number) => void;
  onSave?: () => void;
  isEdit?: boolean;
}

const validationSchema = Yup.object({
  // Basic Information
  jobTitle: Yup.string().required("Job title is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  pan: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
    .optional(),
  currentLocation: Yup.string(),
  preferredLocations: Yup.array().of(Yup.string()),
  totalExperience: Yup.number().min(0),

  // Previous company name

  // organization: Yup.string(),
  // designation: Yup.string(),
  // startDate: Yup.date().optional(),
  // endDate: Yup.date().optional(),

  // Current Job
  currentCompanyName: Yup.string(),
  currentCompanyDesignation: Yup.string(),
  department: Yup.string(),
  role: Yup.string(),
  industry: Yup.string(),
  keySkills: Yup.array().of(Yup.string()),
  annualSalary: Yup.number().min(0),
  noticePeriod: Yup.string(),
  resumeHeadline: Yup.string(),
  summary: Yup.string(),

  // Experience
  experience: Yup.array()
    .of(
      Yup.object().shape({
        companyName: Yup.string().required("Company name is required"),
        companyDesignation: Yup.string().required("Designation is required"),
        department: Yup.string().optional(),
        role: Yup.string().optional(),
        industry: Yup.string().optional(),
        keySkills: Yup.array().of(Yup.string()).optional(),
        annualSalary: Yup.number().min(0).optional(),
        noticePeriod: Yup.string().optional(),
        resumeHeadline: Yup.string().optional(),
        summary: Yup.string().optional(),
        workStart: Yup.string().optional(),
        workEnd: Yup.string().nullable().optional(),
        isCurrent: Yup.boolean().optional(),
      })
    )
    .optional(),

  // Education

  tenthSchool: Yup.string(),
  tenthBoard: Yup.string(),
  tenthCgpa: Yup.string(),
  tenthpassingyear: Yup.number()
    .max(new Date().getFullYear() + 5)
    .optional(),

  twelfthSchool: Yup.string(),
  twelfthBoard: Yup.string(),
  twelfthCgpa: Yup.string(),
  twelfthpassingyear: Yup.number()
    .max(new Date().getFullYear() + 5)
    .optional(),

  ugDegree: Yup.string(),
  ugSpecialization: Yup.string(),
  ugUniversity: Yup.string(),
  ugGraduationYear: Yup.number()
    .max(new Date().getFullYear() + 5)
    .optional(),

  pgDegree: Yup.string(),
  pgSpecialization: Yup.string(),
  pgUniversity: Yup.string(),
  pgGraduationYear: Yup.number()
    .max(new Date().getFullYear() + 5)
    .optional(),

  doctorateDegree: Yup.string(),
  doctorateSpecialization: Yup.string(),
  doctorateUniversity: Yup.string(),
  doctorateGraduationYear: Yup.number()
    .max(new Date().getFullYear() + 5)
    .optional(),

  //certificationsname

  certificationsname: Yup.string(),
  certificationID: Yup.string(),
  certificationStartDate: Yup.date().optional(),
  certificationEndDate: Yup.date().optional(),

  //   certifications: Yup.array().of(
  //   Yup.object({
  //     name: Yup.string().required("Certification name is required"),
  //     certificationID: Yup.string(),
  //     startDate: Yup.date().optional(),
  //     endDate: Yup.date().optional(),
  //   })
  // ),
  // Personal Information
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other", "Prefer not to say"])
    .optional(),
  maritalStatus: Yup.string()
    .oneOf(["Single", "Married", "Divorced", "Widowed", "Other"])
    .optional(),
  homeTown: Yup.string(),
  pinCode: Yup.string(),
  workPermitUSA: Yup.boolean(),
  dateOfBirth: Yup.date().optional(),
  permanentAddress: Yup.string(),
});

const steps = [
  "Basic Information",
  "Professional Details",
  "Education",
  "Personal Details",
];

// Map field names to their corresponding steps
const fieldToStepMap: Record<string, number> = {
  // Step 0: Basic Information
  jobTitle: 0,
  dateOfApplication: 0,
  name: 0,
  email: 0,
  phoneNumber: 0,
  pan: 0,
  currentLocation: 0,
  preferredLocations: 0,

  // Step 1: Professional Details
  totalExperience: 1,
  previouscompanyname: 1,
  previousjobtitle: 1,
  joiningdate: 1,
  enddate: 1,

  // organization: 1,
  // designation: 1,
  // startDate: 1,
  // endDate: 1,

  currentCompanyName: 1,
  currentCompanyDesignation: 1,
  department: 1,
  role: 1,
  industry: 1,
  keySkills: 1,
  experience: 1,
  annualSalary: 1,
  noticePeriod: 1,
  resumeHeadline: 1,
  summary: 1,
  // Step 2: Education
  tenthSchool: 2,
  tenthBoard: 2,
  tenthCgpa: 2,
  tenthpassingyear: 2,
  twelfthSchool: 2,
  twelfthBoard: 2,
  twelfthCgpa: 2,
  twelfthpassingyear: 2,
  ugDegree: 2,
  ugSpecialization: 2,
  ugUniversity: 2,
  ugGraduationYear: 2,
  pgDegree: 2,
  pgSpecialization: 2,
  pgUniversity: 2,
  pgGraduationYear: 2,

  certificationsname: 2,
  certificationID: 2,
  certificationStartDate: 2,
  certificationEndDate: 2,
// certifications: 2,

  doctorateDegree: 2,
  doctorateSpecialization: 2,
  doctorateUniversity: 2,
  doctorateGraduationYear: 2,

  // Step 3: Personal Details
  gender: 3,
  maritalStatus: 3,
  homeTown: 3,
  pinCode: 3,
  workPermitUSA: 3,
  dateOfBirth: 3,
  permanentAddress: 3,

  
};

// Function to find the step with the first validation error
const findStepWithFirstError = (errors: Record<string, any>): number => {
  const errorFields = Object.keys(errors);
  if (errorFields.length === 0) return 0;

  // Find the step for the first error field
  const firstErrorField = errorFields[0];
  return fieldToStepMap[firstErrorField] || 0;
};

export const CandidateForm: React.FC<CandidateFormProps> = ({
  initialData,
  activeStep = 0,
  onStepChange,
  onSave,
  isEdit = false,
}) => {
  const [currentStep, setCurrentStep] = useState(() => {
    // Try to get saved step from localStorage
    const savedStep = localStorage.getItem("candidateFormStep");
    return savedStep ? parseInt(savedStep) : activeStep;
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get saved form data from localStorage or use initial data
  const getInitialValues = () => {
    if (initialData) {
      return {
        jobTitle: initialData.jobTitle || "",
        dateOfApplication: initialData.dateOfApplication
          ? new Date(initialData.dateOfApplication).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        pan: initialData.pan || "",
        currentLocation: initialData.currentLocation || "",
        preferredLocations: initialData.preferredLocations || [],
        totalExperience: initialData.totalExperience || 0,
        currentCompanyName: initialData.currentCompanyName || "",
        currentCompanyDesignation: initialData.currentCompanyDesignation || "",
        department: initialData.department || "",
        role: initialData.role || "",
        industry: initialData.industry || "",
        keySkills: initialData.keySkills || [],
        experience: (initialData as any).experience || [],
        annualSalary: initialData.annualSalary || 0,
        noticePeriod: initialData.noticePeriod || "",
        resumeHeadline: initialData.resumeHeadline || "",
        summary: initialData.summary || "",
       
        tenthSchool: initialData.tenthSchool || "",
        tenthBoard: initialData.tenthBoard || "",
        tenthCgpa: initialData.tenthCgpa || "",
        tenthpassingyear: initialData.tenthpassingyear || "",
        twelfthSchool: initialData.twelfthSchool || "",
        twelfthBoard: initialData.twelfthBoard || "",
        twelfthCgpa: initialData.twelfthCgpa || "",
        twelfthpassingyear: initialData.twelfthpassingyear || "",
        ugDegree: initialData.ugDegree || "",
        ugSpecialization: initialData.ugSpecialization || "",
        ugUniversity: initialData.ugUniversity || "",
        ugGraduationYear: initialData.ugGraduationYear || 0,
        pgDegree: initialData.pgDegree || "",
        pgSpecialization: initialData.pgSpecialization || "",
        pgUniversity: initialData.pgUniversity || "",
        pgGraduationYear: initialData.pgGraduationYear || 0,
        doctorateDegree: initialData.doctorateDegree || "",
        doctorateSpecialization: initialData.doctorateSpecialization || "",
        doctorateUniversity: initialData.doctorateUniversity || "",
        doctorateGraduationYear: initialData.doctorateGraduationYear || 0,
        gender: initialData.gender || "",
        maritalStatus: initialData.maritalStatus || "",
        homeTown: initialData.homeTown || "",
        pinCode: initialData.pinCode || "",
        workPermitUSA: initialData.workPermitUSA || false,
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
        permanentAddress: initialData.permanentAddress || "",
        resumeUrl: initialData.resumeUrl || "",
      };
    }

    // Try to get saved form data from localStorage
    const savedFormData = localStorage.getItem("candidateFormData");
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        return {
          jobTitle: parsed.jobTitle || "",
          dateOfApplication:
            parsed.dateOfApplication || new Date().toISOString().split("T")[0],
          name: parsed.name || "",
          email: parsed.email || "",
          phoneNumber: parsed.phoneNumber || "",
          pan: parsed.pan || "",
          currentLocation: parsed.currentLocation || "",
          preferredLocations: parsed.preferredLocations || [],
          totalExperience: parsed.totalExperience || 0,
          currentCompanyName: parsed.currentCompanyName || "",
          currentCompanyDesignation: parsed.currentCompanyDesignation || "",
          department: parsed.department || "",
          role: parsed.role || "",
          industry: parsed.industry || "",
          keySkills: parsed.keySkills || [],
          experience: parsed.experience || [],
          annualSalary: parsed.annualSalary || 0,
          noticePeriod: parsed.noticePeriod || "",
          resumeHeadline: parsed.resumeHeadline || "",
          summary: parsed.summary || "",

          tenthSchool: parsed.tenthSchool || "",
          tenthBoard: parsed.tenthBoard || "",
          tenthCgpa: parsed.tenthCgpa || "",
          tenthpassingyear: parsed.tenthpassingyear || "",
          twelfthSchool: parsed.twelfthSchool || "",
          twelfthBoard: parsed.twelfthBoard || "",
          twelfthCgpa: parsed.twelfthCgpa || "",
          twelfthpassingyear: parsed.twelfthpassingyear || "",

          ugDegree: parsed.ugDegree || "",
          ugSpecialization: parsed.ugSpecialization || "",
          ugUniversity: parsed.ugUniversity || "",
          ugGraduationYear: parsed.ugGraduationYear || 0,
          pgDegree: parsed.pgDegree || "",
          pgSpecialization: parsed.pgSpecialization || "",
          pgUniversity: parsed.pgUniversity || "",
          pgGraduationYear: parsed.pgGraduationYear || 0,
          doctorateDegree: parsed.doctorateDegree || "",
          doctorateSpecialization: parsed.doctorateSpecialization || "",
          doctorateUniversity: parsed.doctorateUniversity || "",
          doctorateGraduationYear: parsed.doctorateGraduationYear || 0,
          gender: parsed.gender || "",
          maritalStatus: parsed.maritalStatus || "",
          homeTown: parsed.homeTown || "",
          pinCode: parsed.pinCode || "",
          workPermitUSA: parsed.workPermitUSA || false,
          dateOfBirth: parsed.dateOfBirth || "",
          permanentAddress: parsed.permanentAddress || "",
          resumeUrl: parsed.resumeUrl || "",
        };
      } catch (error) {
        console.warn("Failed to parse saved form data:", error);
      }
    }

    // Default values
    return {
      jobTitle: "",
      dateOfApplication: new Date().toISOString().split("T")[0],
      name: "",
      email: "",
      phoneNumber: "",
      pan: "",
      currentLocation: "",
      preferredLocations: [],
      totalExperience: 0,
      currentCompanyName: "",
      currentCompanyDesignation: "",
      department: "",
      role: "",
      industry: "",
      keySkills: [],
      experience: [],
      annualSalary: 0,
      noticePeriod: "",
      resumeHeadline: "",
      summary: "",

      tenthSchool: "",
      tenthBoard: "",
      tenthCgpa: "",
      tenthpassingyear: "",
      twelfthSchool: "",
      twelfthBoard: "",
      twelfthCgpa: "",
      twelfthpassingyear: "",
      ugDegree: "",
      ugSpecialization: "",
      ugUniversity: "",
      ugGraduationYear: 0,
      pgDegree: "",
      pgSpecialization: "",
      pgUniversity: "",
      pgGraduationYear: 0,
      doctorateDegree: "",
      doctorateSpecialization: "",
      doctorateUniversity: "",
      doctorateGraduationYear: 0,
      gender: "",
      maritalStatus: "",
      homeTown: "",
      pinCode: "",
      workPermitUSA: false,
      dateOfBirth: "",
      permanentAddress: "",
      resumeUrl: "",
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form submission started with values:", values);
      console.log("Form errors:", formik.errors);
      console.log("Form touched:", formik.touched);

      // Check if there are validation errors
      if (Object.keys(formik.errors).length > 0) {
        console.log("Form has validation errors:", formik.errors);

        // Find the step with the first error
        const errorStep = findStepWithFirstError(formik.errors);

        // Navigate to the step with the error
        setCurrentStep(errorStep);
        onStepChange?.(errorStep);

        // Show error message
        const errorFields = Object.keys(formik.errors);
        const errorMessages = errorFields
          .map((field) => `${field}: ${(formik.errors as any)[field]}`)
          .join(", ");
        setError(`Please fix the following errors: ${errorMessages}`);

        // Scroll to top to show the error
        window.scrollTo({ top: 0, behavior: "smooth" });

        return; // Don't proceed with submission
      }

      try {
        setIsSubmitting(true);
        setError(null);

        // Convert form values to proper types for API
        const apiData: Partial<Candidate> = {
          ...values,
          dateOfApplication: values.dateOfApplication
            ? new Date(values.dateOfApplication)
            : new Date(),
          dateOfBirth: values.dateOfBirth
            ? new Date(values.dateOfBirth)
            : undefined,
          gender: values.gender as
            | "Male"
            | "Female"
            | "Other"
            | "Prefer not to say"
            | undefined,
          maritalStatus: values.maritalStatus as
            | "Single"
            | "Married"
            | "Divorced"
            | "Widowed"
            | "Other"
            | undefined,
          experience: (values as any).experience?.map((e: any) => ({
            ...e,
            workStart: e.workStart ? new Date(e.workStart) : undefined,
            workEnd: e.isCurrent
              ? undefined
              : e.workEnd
              ? new Date(e.workEnd)
              : undefined,
          })),
        };

        console.log("API data to be sent:", apiData);

        if (isEdit && initialData?._id) {
          console.log("Updating existing profile...");
          await candidateApi.updateProfile(initialData._id, apiData);
        } else {
          console.log("Creating new profile...");
          await candidateApi.createProfile(apiData);
        }

        console.log("Profile saved successfully!");

        // Clear saved data after successful submission
        localStorage.removeItem("candidateFormStep");
        localStorage.removeItem("candidateFormData");
        onSave?.();
      } catch (err: any) {
        console.error("Form submission error:", err);
        setError(err.message || "Failed to save profile");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

  // Reset form when initialData changes (when profile is fetched)
  useEffect(() => {
    if (initialData) {
      console.log("Resetting form with initial data:", initialData);
      formik.resetForm({ values: getInitialValues() });
    }
  }, [initialData]);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("candidateFormStep", currentStep.toString());
  }, [currentStep]);

  // Save form data to localStorage whenever it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("candidateFormData", JSON.stringify(formik.values));
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [formik.values]);

  // Helper to union arrays of strings
  const unionStrings = (a: string[], b: string[]) =>
    Array.from(new Set([...(a || []), ...(b || [])]));

  // Keep current company synced into experience array and merge skills
  useEffect(() => {
    const values: any = formik.values;
    const {
      currentCompanyName,
      currentCompanyDesignation,
      department,
      role,
      industry,
      keySkills,
      annualSalary,
      noticePeriod,
      resumeHeadline,
      summary,
      experience,
    } = values;

    if (!currentCompanyName && !currentCompanyDesignation) return;

    const exp: any[] = Array.isArray(experience) ? [...experience] : [];
    const currentIdx = exp.findIndex((e) => e && e.isCurrent);
    const currentExp = {
      companyName: currentCompanyName || "",
      companyDesignation: currentCompanyDesignation || "",
      department: department || "",
      role: role || "",
      industry: industry || "",
      keySkills: keySkills || [],
      annualSalary: annualSalary ?? undefined,
      noticePeriod: noticePeriod || "",
      resumeHeadline: resumeHeadline || "",
      summary: summary || "",
      workStart: currentIdx >= 0 ? exp[currentIdx]?.workStart || "" : "",
      workEnd: null,
      isCurrent: true,
    };

    if (currentIdx >= 0) {
      exp[currentIdx] = { ...exp[currentIdx], ...currentExp };
    } else {
      exp.unshift(currentExp);
    }

    const mergedSkills = unionStrings(
      keySkills || [],
      currentExp.keySkills || []
    );

    if (JSON.stringify(exp) !== JSON.stringify(experience)) {
      formik.setFieldValue("experience", exp, false);
    }
    if (JSON.stringify(mergedSkills) !== JSON.stringify(keySkills)) {
      formik.setFieldValue("keySkills", mergedSkills, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.currentCompanyName,
    formik.values.currentCompanyDesignation,
    formik.values.department,
    formik.values.role,
    formik.values.industry,
    formik.values.keySkills,
    formik.values.annualSalary,
    formik.values.noticePeriod,
    formik.values.resumeHeadline,
    formik.values.summary,
  ]);

  // Auto-fill form fields from resume data
  const autoFillFromResume = (resumeData: any) => {
    console.log("Auto-filling form with data:", resumeData);

    if (resumeData.name) formik.setFieldValue("name", resumeData.name);
    if (resumeData.email) formik.setFieldValue("email", resumeData.email);
    if (resumeData.phone) formik.setFieldValue("phoneNumber", resumeData.phone);
    if (resumeData.location)
      formik.setFieldValue("currentLocation", resumeData.location);
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
      formik.setFieldValue("keySkills", resumeData.skills);
    }
    if (resumeData.experience)
      formik.setFieldValue("totalExperience", resumeData.experience);
    if (resumeData.currentCompany)
      formik.setFieldValue("currentCompanyName", resumeData.currentCompany);
    if (resumeData.currentTitle)
      formik.setFieldValue(
        "currentCompanyDesignation",
        resumeData.currentTitle
      );
    if (resumeData.summary) formik.setFieldValue("summary", resumeData.summary);

    // Handle education data
    if (resumeData.education) {
      const education = resumeData.education;
      if (education.tenth) {
        if (education.tenth.shcool)
          formik.setFieldValue("tenthSchool", education.tenth.school);
        if (education.tenth.board)
          formik.setFieldValue("tenthBoard", education.tenth.board);
        if (education.tenth.cgpa)
          formik.setFieldValue("tenthCgpa", education.tenth.cgpa);
        if (education.tenth.year)
          formik.setFieldValue("tenthpassingyear", education.tenth.year);
      }
      if (education.twelfth) {
        if (education.twelfth.shcool)
          formik.setFieldValue("twelfthSchool", education.twelfth.school);
        if (education.twelfth.board)
          formik.setFieldValue("twelfthBoard", education.twelfth.board);
        if (education.twelfth.cgpa)
          formik.setFieldValue("twelfthCgpa", education.twelfth.cgpa);
        if (education.twelfth.year)
          formik.setFieldValue("twelfthpassingyear", education.twelfth.year);
      }

      if (education.ug) {
        if (education.ug.degree)
          formik.setFieldValue("ugDegree", education.ug.degree);
        if (education.ug.specialization)
          formik.setFieldValue("ugSpecialization", education.ug.specialization);
        if (education.ug.university)
          formik.setFieldValue("ugUniversity", education.ug.university);
        if (education.ug.year)
          formik.setFieldValue("ugGraduationYear", education.ug.year);
      }
      if (education.pg) {
        if (education.pg.degree)
          formik.setFieldValue("pgDegree", education.pg.degree);
        if (education.pg.specialization)
          formik.setFieldValue("pgSpecialization", education.pg.specialization);
        if (education.pg.university)
          formik.setFieldValue("pgUniversity", education.pg.university);
        if (education.pg.year)
          formik.setFieldValue("pgGraduationYear", education.pg.year);
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
        formik.setFieldValue("resumeUrl", response.data.fileUrl);

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

  const handleNext = () => {
    // Validate current step before proceeding
    const currentStepFields = Object.keys(fieldToStepMap).filter(
      (field) => fieldToStepMap[field] === currentStep
    );
    const currentStepErrors = currentStepFields.filter(
      (field) => (formik.errors as any)[field]
    );

    if (currentStepErrors.length > 0) {
      // Show error message for current step
      const errorMessages = currentStepErrors
        .map((field) => `${field}: ${(formik.errors as any)[field]}`)
        .join(", ");
      setError(
        `Please fix the following errors in ${steps[currentStep]}: ${errorMessages}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    onStepChange?.(nextStep);
    setError(null); // Clear any previous errors
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
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
                      Please wait while we extract information from your resume
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
                    {formik.values.resumeUrl && (
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="jobTitle"
                label="Job Title"
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                error={
                  formik.touched.jobTitle && Boolean(formik.errors.jobTitle)
                }
                helperText={
                  formik.touched.jobTitle && formik.errors.jobTitle
                    ? String(formik.errors.jobTitle)
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="dateOfApplication"
                label="Date of Application"
                type="date"
                value={formik.values.dateOfApplication}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  formik.touched.name && formik.errors.name
                    ? String(formik.errors.name)
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  formik.touched.email && formik.errors.email
                    ? String(formik.errors.email)
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? String(formik.errors.phoneNumber)
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pan"
                label="PAN Number"
                value={formik.values.pan}
                onChange={formik.handleChange}
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                helperText={
                  formik.touched.pan && formik.errors.pan
                    ? String(formik.errors.pan)
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="currentLocation"
                label="Current Location"
                value={formik.values.currentLocation}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formik.values.preferredLocations}
                onChange={(_event, newValue) => {
                  formik.setFieldValue("preferredLocations", newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Preferred Locations"
                    placeholder="Add locations..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Previous company
              </Typography>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="organization"
                label="Organization name"
                value={formik.values.organization}
                onChange={formik.handleChange}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="designation"
                label="Designation "
                value={formik.values.designation}
                onChange={formik.handleChange}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="startDate"
                label="Start Date"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="endDate"
                label="End Date"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Current Company
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="currentCompanyName"
                label="Current Company Name"
                value={formik.values.currentCompanyName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="currentCompanyDesignation"
                label="Current Company Designation"
                value={formik.values.currentCompanyDesignation}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="department"
                label="Department"
                value={formik.values.department}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="role"
                label="Role"
                value={formik.values.role}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="industry"
                label="Industry"
                value={formik.values.industry}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="totalExperience"
                label="Total Experience (Years)"
                type="number"
                value={formik.values.totalExperience}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formik.values.keySkills}
                onChange={(_event, newValue) => {
                  formik.setFieldValue("keySkills", newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Key Skills"
                    placeholder="Add skills..."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="annualSalary"
                label="Annual Salary (LPA)"
                type="number"
                value={formik.values.annualSalary}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="noticePeriod"
                label="Notice Period"
                value={formik.values.noticePeriod}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="resumeHeadline"
                label="Resume Headline"
                value={formik.values.resumeHeadline}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="summary"
                label="Summary"
                value={formik.values.summary}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Experience Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Typography variant="h6">Experience</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const next = [
                      ...((formik.values as any).experience || []),
                      {
                        companyName: "",
                        companyDesignation: "",
                        department: "",
                        role: "",
                        industry: "",
                        keySkills: [],
                        annualSalary: undefined,
                        noticePeriod: "",
                        resumeHeadline: "",
                        summary: "",
                        workStart: "",
                        workEnd: "",
                        isCurrent: false,
                      },
                    ];
                    formik.setFieldValue("experience", next);
                  }}
                >
                  + Add Experience
                </Button>
              </Box>
            </Grid>

            {Array.isArray((formik.values as any).experience) &&
              (formik.values as any).experience.map((exp: any, idx: number) => {
                return (
                  <Grid item xs={12} key={idx}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Company Name"
                            value={exp.companyName || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                companyName: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Designation"
                            value={exp.companyDesignation || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                companyDesignation: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Department"
                            value={exp.department || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                department: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Role"
                            value={exp.role || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = { ...arr[idx], role: e.target.value };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Industry"
                            value={exp.industry || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                industry: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Annual Salary (LPA)"
                            type="number"
                            value={exp.annualSalary || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              const val =
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value);
                              arr[idx] = { ...arr[idx], annualSalary: val };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Work Start"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={exp.workStart || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                workStart: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label={
                              exp.isCurrent
                                ? "Current (no end date)"
                                : "Work End"
                            }
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={exp.isCurrent ? "" : exp.workEnd || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                workEnd: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                            disabled={!!exp.isCurrent}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={exp.keySkills || []}
                            onChange={(_event, newValue) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = { ...arr[idx], keySkills: newValue };
                              formik.setFieldValue("experience", arr);
                              const merged = unionStrings(
                                (formik.values as any).keySkills || [],
                                newValue || []
                              );
                              formik.setFieldValue("keySkills", merged);
                            }}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  variant="outlined"
                                  label={option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Experience Key Skills"
                                placeholder="Add skills..."
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Notice Period"
                            value={exp.noticePeriod || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                noticePeriod: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!exp.isCurrent}
                                onChange={(e) => {
                                  const arr = [
                                    ...((formik.values as any).experience ||
                                      []),
                                  ];
                                  const updated = arr.map((item, i) => ({
                                    ...item,
                                    isCurrent:
                                      i === idx ? e.target.checked : false,
                                  }));
                                  formik.setFieldValue("experience", updated);
                                }}
                              />
                            }
                            label="I currently work here"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Summary"
                            multiline
                            rows={3}
                            value={exp.summary || ""}
                            onChange={(e) => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr[idx] = {
                                ...arr[idx],
                                summary: e.target.value,
                              };
                              formik.setFieldValue("experience", arr);
                            }}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Button
                            color="error"
                            onClick={() => {
                              const arr = [
                                ...((formik.values as any).experience || []),
                              ];
                              arr.splice(idx, 1);
                              formik.setFieldValue("experience", arr);
                            }}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                10th School
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="tenthSchool"
                label="tenth school"
                value={formik.values.tenthSchool}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="tenthBoard"
                label="tenth Board"
                value={formik.values.tenthBoard}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="tenthCgpa"
                label="tenth Cgpa"
                value={formik.values.tenthCgpa}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="tenthpassingyear"
                label="tenthpassing year"
                value={formik.values.tenthpassingyear}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                12th School
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="twelfthSchool"
                label="twelfth School"
                value={formik.values.twelfthSchool}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="twelfthBoard"
                label="twelfth Board"
                value={formik.values.twelfthBoard}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="twelfthCgpa"
                label="twelfth Cgpa"
                value={formik.values.twelfthCgpa}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="twelfthpassingyear"
                label="twelfthpassing year"
                value={formik.values.twelfthpassingyear}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Under Graduation
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="ugDegree"
                label="UG Degree"
                value={formik.values.ugDegree}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="ugSpecialization"
                label="UG Specialization"
                value={formik.values.ugSpecialization}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="ugUniversity"
                label="UG University/Institute Name"
                value={formik.values.ugUniversity}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="ugGraduationYear"
                label="UG Graduation Year"
                type="number"
                value={formik.values.ugGraduationYear}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Post Graduation
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pgDegree"
                label="PG Degree"
                value={formik.values.pgDegree}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pgSpecialization"
                label="PG Specialization"
                value={formik.values.pgSpecialization}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pgUniversity"
                label="PG University/Institute Name"
                value={formik.values.pgUniversity}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pgGraduationYear"
                label="PG Graduation Year"
                type="number"
                value={formik.values.pgGraduationYear}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Doctorate
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="doctorateDegree"
                label="Doctorate Degree"
                value={formik.values.doctorateDegree}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="doctorateSpecialization"
                label="Doctorate Specialization"
                value={formik.values.doctorateSpecialization}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="doctorateUniversity"
                label="Doctorate University/Institute Name"
                value={formik.values.doctorateUniversity}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="doctorateGraduationYear"
                label="Doctorate Graduation Year"
                type="number"
                value={formik.values.doctorateGraduationYear}
                onChange={formik.handleChange}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Certifications
              </Typography>
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="certificationsname"
                label="certifications name"
                value={formik.values.certificationsname}
                onChange={formik.handleChange}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="certificationID"
                label="certification ID"
                value={formik.values.certificationID}
                onChange={formik.handleChange}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="certificationStartDate"
                label="certification StartDate"
                type="date"
                value={formik.values.certificationStartDate}
                onChange={formik.handleChange}
                 InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="certificationEndDate"
                label="certification EndDate"
                type="date"
                value={formik.values.certificationEndDate}
                onChange={formik.handleChange}
                 InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid> */}
             {/* <FieldArray name="certifications">
              {({ push, remove }) => (
                <>
                  {formik.values.certifications.map((cert, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name={`certifications[${index}].name`}
                          label="Certification Name"
                          value={cert.name}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.certifications &&
                            formik.touched.certifications[index]?.name &&
                            Boolean(
                              formik.errors.certifications &&
                                (formik.errors.certifications as any)[index]
                                  ?.name
                            )
                          }
                          helperText={
                            formik.touched.certifications &&
                            formik.touched.certifications[index]?.name &&
                            (formik.errors.certifications as any)[index]?.name
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name={`certifications[${index}].certificationID`}
                          label="Certification ID"
                          value={cert.certificationID}
                          onChange={formik.handleChange}
                        />
                         </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name={`certifications[${index}].startDate`}
                          label="Start Date"
                          type="date"
                          value={cert.startDate}
                          onChange={formik.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          name={`certifications[${index}].endDate`}
                          label="End Date"
                          type="date"
                          value={cert.endDate}
                          onChange={formik.handleChange}
                          InputLabelProps={{ shrink: true }}
                        />
                        </Grid>
                      <Grid item xs={12}>
                        <Button
                          color="error"
                          onClick={() => remove(index)}
                          disabled={formik.values.certifications.length === 1}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() =>
                      push({
                        name: "",
                        certificationID: "",
                        startDate: "",
                        endDate: "",
                      })
                      }
                  >
                    + Add Certification
                  </Button>
                </>
              )}
            </FieldArray> */}
            
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="gender"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                {["Male", "Female", "Other", "Prefer not to say"].map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="maritalStatus"
                label="Marital Status"
                value={formik.values.maritalStatus}
                onChange={formik.handleChange}
              >
                {["Single", "Married", "Divorced", "Widowed", "Other"].map(
                  (option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="homeTown"
                label="Home Town/City"
                value={formik.values.homeTown}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="pinCode"
                label="Pin Code"
                value={formik.values.pinCode}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.workPermitUSA}
                    onChange={formik.handleChange}
                    name="workPermitUSA"
                  />
                }
                label="Work Permit for USA"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="permanentAddress"
                label="Permanent Address"
                value={formik.values.permanentAddress}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        );
      // case 4: // Experiences
      //   return (
      //     <FieldArray name="experiences">
      //       {({ push, remove }) => (
      //         <Box>
      //           {formik.values.experiences.map((exp, index) => (
      //             <Grid container spacing={2} key={index}>
      //               <Grid item xs={12} md={6}>
      //                 <TextField
      //                   fullWidth
      //                   name={`experiences[${index}].companyName`}
      //                   label="Company Name"
      //                   value={exp.companyName}
      //                   onChange={formik.handleChange}
      //                 />
      //               </Grid>
      //               <Grid item xs={12} md={6}>
      //                 <TextField
      //                   fullWidth
      //                   name={`experiences[${index}].designation`}
      //                   label="Designation"
      //                   value={exp.designation}
      //                   onChange={formik.handleChange}
      //                 />
      //               </Grid>
      //               <Grid item xs={12}>
      //                 <Button color="error" onClick={() => remove(index)}>
      //                   Remove
      //                 </Button>
      //               </Grid>
      //             </Grid>
      //           ))}
      //           <Button
      //             variant="outlined"
      //             onClick={() =>
      //               push({
      //                 companyName: "",
      //                 designation: "",
      //                 startDate: "",
      //                 endDate: "",
      //                 description: "",
      //               })
      //             }
      //           >
      //             + Add Experience
      //           </Button>
      //         </Box>
      //       )}
      //     </FieldArray>
      //   );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? "Edit Profile" : "Candidate Profile"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {uploadSuccess}
        </Alert>
      )}

      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => {
          // Check if this step has any errors
          const stepFields = Object.keys(fieldToStepMap).filter(
            (field) => fieldToStepMap[field] === index
          );
          const hasErrors = stepFields.some(
            (field) => (formik.errors as any)[field]
          );

          return (
            <Step key={label}>
              <StepLabel
                error={hasErrors}
                StepIconProps={{
                  style: hasErrors ? { color: "#d32f2f" } : undefined,
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <form onSubmit={formik.handleSubmit}>
        {renderStepContent(currentStep)}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              onClick={() => {
                console.log("Submit button clicked!");
                console.log("Current form values:", formik.values);
                console.log("Form errors:", formik.errors);
                console.log("Form is valid:", formik.isValid);
                console.log("Form is dirty:", formik.dirty);
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} />
              ) : isEdit ? (
                "Update"
              ) : (
                "Submit"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  );
};
