import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/services/api';
import { AuthState, LoginResponse } from '@/types';
import { RootState } from '../store';

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phoneNumber: string) => {
    const response = await authApi.sendOtp(phoneNumber);
    return response.data;
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => {
    const response = await authApi.verifyOtp(phoneNumber, otp);
    return response.data; // Access the data property of the axios response
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async () => {
    const response = await authApi.getProfile();
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: any) => {
    const response = await authApi.updateProfile(data);
    return response.data;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send OTP';
      });

    // Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        const { token, user } = action.payload as LoginResponse;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = token;
        // Map the API response user to our User interface
        state.user = {
          ...user,
          _id: user.id || user._id, // Handle both id and _id fields
        };
        localStorage.setItem('token', token);
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to verify OTP';
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.user) {
          state.user = {
            ...action.payload.user,
            _id: action.payload.user.id || action.payload.user._id, // Handle both id and _id fields
          };
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get profile';
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.user) {
          state.user = {
            ...action.payload.user,
            _id: action.payload.user.id || action.payload.user._id, // Handle both id and _id fields
          };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

// Actions
export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer; 