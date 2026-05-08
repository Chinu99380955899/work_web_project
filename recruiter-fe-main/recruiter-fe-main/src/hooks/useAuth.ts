import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  sendOtp,
  verifyOtp,
  getProfile,
  updateProfile,
  logout,
  clearError,
} from "@/store/slices/authSlice";
import { User } from "@/types";
import { AppDispatch } from "@/store/store";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Fetch user profile if authenticated but user data is missing
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleSendOtp = useCallback(
    async (phoneNumber: string) => {
      try {
        await dispatch(sendOtp(phoneNumber)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleVerifyOtp = useCallback(
    async (phoneNumber: string, otp: string) => {
      try {
        const result = await dispatch(verifyOtp({ phoneNumber, otp })).unwrap();

        // Fetch user profile after successful login
        await dispatch(getProfile()).unwrap();

        // Redirect based on user role
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result.user.role === "recruiter") {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/candidate/profile");
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch, navigate]
  );

  const handleGetProfile = useCallback(async () => {
    try {
      await dispatch(getProfile()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const handleUpdateProfile = useCallback(
    async (data: Partial<User>) => {
      try {
        await dispatch(updateProfile(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  const hasPermission = useCallback(
    (permission: string) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return user.permissions?.includes(permission) || false;
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    },
    [user]
  );

  return {
    auth,
    user,
    isAuthenticated,
    isLoading,
    error,
    sendOtp: handleSendOtp,
    verifyOtp: handleVerifyOtp,
    getProfile: handleGetProfile,
    updateProfile: handleUpdateProfile,
    logout: handleLogout,
    clearError: handleClearError,
    checkAuth,
    hasPermission,
    hasRole,
  };
};
