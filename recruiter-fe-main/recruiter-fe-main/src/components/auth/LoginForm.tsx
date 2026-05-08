import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .required('Phone number is required'),
  otp: Yup.string()
    .matches(/^\d{6}$/, 'OTP must be 6 digits')
    .when('otpSent', {
      is: true,
      then: (schema) => schema.required('OTP is required'),
      otherwise: (schema) => schema,
    }),
});

export const LoginForm: React.FC = () => {
  const { sendOtp, verifyOtp, isLoading, error, clearError } = useAuth();
  const [otpSent, setOtpSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      otp: '',
      otpSent: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!otpSent) {
        const success = await sendOtp(values.phoneNumber);
        if (success) {
          setOtpSent(true);
          formik.setFieldValue('otpSent', true);
        }
      } else {
        await verifyOtp(values.phoneNumber, values.otp);
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          {otpSent ? 'Enter OTP' : 'Login / Register'}
        </Typography>

        {error && (
          <Alert severity="error" onClose={clearError}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              placeholder="+91XXXXXXXXXX"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              disabled={otpSent || isLoading}
            />

            {otpSent && (
              <TextField
                fullWidth
                id="otp"
                name="otp"
                label="OTP"
                placeholder="Enter 6-digit OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
                disabled={isLoading}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : otpSent ? (
                'Verify OTP'
              ) : (
                'Send OTP'
              )}
            </Button>

            {otpSent && (
              <Button
                variant="text"
                fullWidth
                onClick={() => {
                  setOtpSent(false);
                  formik.setFieldValue('otp', '');
                  formik.setFieldValue('otpSent', false);
                }}
                disabled={isLoading}
              >
                Change Phone Number
              </Button>
            )}
          </Box>
        </form>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Typography>
      </Paper>
    </Box>
  );
}; 