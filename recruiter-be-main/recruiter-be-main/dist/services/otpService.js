"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPhoneNumber = exports.isValidPhoneNumber = exports.verifyOtpOfUser = exports.sendOtp = void 0;
const axios_1 = __importDefault(require("axios"));
const errorHandler_1 = require("../middleware/errorHandler");
const sendOtp = async (phoneNumber) => {
    try {
        const apiKey = process.env.SMS_OTP_KEY;
        if (!apiKey) {
            throw new errorHandler_1.ApiError(500, 'SMS OTP API key not configured');
        }
        const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
        const formattedPhoneNumber = cleanPhoneNumber.startsWith('+')
            ? cleanPhoneNumber.substring(1)
            : cleanPhoneNumber.startsWith('91')
                ? cleanPhoneNumber
                : `91${cleanPhoneNumber}`;
        const url = `https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhoneNumber}/AUTOGEN/OTP1`;
        console.log(`🔄 Sending OTP to: ${formattedPhoneNumber}`);
        const response = await axios_1.default.get(url, {
            timeout: 10000,
        });
        console.log(`✅ OTP sent successfully to: ${formattedPhoneNumber}`);
        return response.data;
    }
    catch (error) {
        console.error('❌ Error sending OTP:', error.message);
        if (error.response) {
            throw new errorHandler_1.ApiError(error.response.status || 500, error.response.data?.Details || 'Failed to send OTP');
        }
        else if (error.request) {
            throw new errorHandler_1.ApiError(503, 'OTP service is currently unavailable. Please try again later.');
        }
        else {
            throw new errorHandler_1.ApiError(500, 'Failed to send OTP. Please try again.');
        }
    }
};
exports.sendOtp = sendOtp;
const verifyOtpOfUser = async (phoneNumber, otp) => {
    try {
        const apiKey = process.env.SMS_OTP_KEY;
        if (!apiKey) {
            throw new errorHandler_1.ApiError(500, 'SMS OTP API key not configured');
        }
        const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
        const formattedPhoneNumber = cleanPhoneNumber.startsWith('+')
            ? cleanPhoneNumber.substring(1)
            : cleanPhoneNumber.startsWith('91')
                ? cleanPhoneNumber
                : `91${cleanPhoneNumber}`;
        const cleanOTP = otp.replace(/\D/g, '');
        if (cleanOTP.length !== 6) {
            throw new errorHandler_1.ApiError(400, 'OTP must be 6 digits');
        }
        const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${formattedPhoneNumber}/${cleanOTP}`;
        console.log(`🔄 Verifying OTP for: ${formattedPhoneNumber}`);
        const response = await axios_1.default.get(url, {
            timeout: 10000,
        });
        console.log(`✅ OTP verified successfully for: ${formattedPhoneNumber}`);
        return response.data;
    }
    catch (error) {
        console.error('❌ Error verifying OTP:', error.message);
        if (error.response) {
            const errorMessage = error.response.data?.Details || 'Invalid OTP';
            throw new errorHandler_1.ApiError(error.response.status === 400 ? 400 : 500, errorMessage);
        }
        else if (error.request) {
            throw new errorHandler_1.ApiError(503, 'OTP verification service is currently unavailable. Please try again later.');
        }
        else {
            if (error instanceof errorHandler_1.ApiError) {
                throw error;
            }
            throw new errorHandler_1.ApiError(500, 'Failed to verify OTP. Please try again.');
        }
    }
};
exports.verifyOtpOfUser = verifyOtpOfUser;
const isValidPhoneNumber = (phoneNumber) => {
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    const indianMobileRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return indianMobileRegex.test(cleanPhoneNumber);
};
exports.isValidPhoneNumber = isValidPhoneNumber;
const formatPhoneNumber = (phoneNumber) => {
    const cleanPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanPhoneNumber.startsWith('+91')) {
        return cleanPhoneNumber;
    }
    else if (cleanPhoneNumber.startsWith('91')) {
        return `+${cleanPhoneNumber}`;
    }
    else if (cleanPhoneNumber.length === 10) {
        return `+91${cleanPhoneNumber}`;
    }
    return cleanPhoneNumber;
};
exports.formatPhoneNumber = formatPhoneNumber;
//# sourceMappingURL=otpService.js.map