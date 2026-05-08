import axios from 'axios';
import { ApiError } from '../middleware/errorHandler';

export interface OTPResponse {
  Status: string;
  Details: string;
  OTP?: string;
  SessionId?: string;
}

export interface VerifyOTPResponse {
  Status: string;
  Details: string;
}

export const sendOtp = async (phoneNumber: string): Promise<OTPResponse> => {
  try {
    const apiKey = process.env.SMS_OTP_KEY;
    
    if (!apiKey) {
      throw new ApiError(500, 'SMS OTP API key not configured');
    }

    // Clean phone number - remove any non-digit characters except +
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ensure phone number starts with country code
    const formattedPhoneNumber = cleanPhoneNumber.startsWith('+') 
      ? cleanPhoneNumber.substring(1) 
      : cleanPhoneNumber.startsWith('91') 
        ? cleanPhoneNumber 
        : `91${cleanPhoneNumber}`;

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhoneNumber}/AUTOGEN/OTP1`;
    
    console.log(`🔄 Sending OTP to: ${formattedPhoneNumber}`);
    
    const response = await axios.get(url, {
      timeout: 10000, // 10 seconds timeout
    });

    console.log(`✅ OTP sent successfully to: ${formattedPhoneNumber}`);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error sending OTP:', error.message);
    
    if (error.response) {
      // API responded with an error status
      throw new ApiError(
        error.response.status || 500,
        error.response.data?.Details || 'Failed to send OTP'
      );
    } else if (error.request) {
      // Network error
      throw new ApiError(503, 'OTP service is currently unavailable. Please try again later.');
    } else {
      // Other error
      throw new ApiError(500, 'Failed to send OTP. Please try again.');
    }
  }
};

export const verifyOtpOfUser = async (phoneNumber: string, otp: string): Promise<VerifyOTPResponse> => {
  try {
    const apiKey = process.env.SMS_OTP_KEY;
    
    if (!apiKey) {
      throw new ApiError(500, 'SMS OTP API key not configured');
    }

    // Clean phone number - remove any non-digit characters except +
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ensure phone number starts with country code
    const formattedPhoneNumber = cleanPhoneNumber.startsWith('+') 
      ? cleanPhoneNumber.substring(1) 
      : cleanPhoneNumber.startsWith('91') 
        ? cleanPhoneNumber 
        : `91${cleanPhoneNumber}`;

    // Clean OTP - remove any non-digit characters
    const cleanOTP = otp.replace(/\D/g, '');

    if (cleanOTP.length !== 6) {
      throw new ApiError(400, 'OTP must be 6 digits');
    }

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${formattedPhoneNumber}/${cleanOTP}`;
    
    console.log(`🔄 Verifying OTP for: ${formattedPhoneNumber}`);
    
    const response = await axios.get(url, {
      timeout: 10000, // 10 seconds timeout
    });

    console.log(`✅ OTP verified successfully for: ${formattedPhoneNumber}`);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Error verifying OTP:', error.message);
    
    if (error.response) {
      // API responded with an error status
      const errorMessage = error.response.data?.Details || 'Invalid OTP';
      throw new ApiError(
        error.response.status === 400 ? 400 : 500,
        errorMessage
      );
    } else if (error.request) {
      // Network error
      throw new ApiError(503, 'OTP verification service is currently unavailable. Please try again later.');
    } else {
      // Other error including our custom ApiError
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to verify OTP. Please try again.');
    }
  }
};

// Utility function to validate phone number format
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Remove any non-digit characters except +
  const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
  
  // Check if it's a valid Indian mobile number
  const indianMobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
  
  return indianMobileRegex.test(cleanPhoneNumber);
};

// Utility function to format phone number for storage
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
  
  if (cleanPhoneNumber.startsWith('+91')) {
    return cleanPhoneNumber;
  } else if (cleanPhoneNumber.startsWith('91')) {
    return `+${cleanPhoneNumber}`;
  } else if (cleanPhoneNumber.length === 10) {
    return `+91${cleanPhoneNumber}`;
  }
  
  return cleanPhoneNumber;
}; 