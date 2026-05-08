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
export declare const sendOtp: (phoneNumber: string) => Promise<OTPResponse>;
export declare const verifyOtpOfUser: (phoneNumber: string, otp: string) => Promise<VerifyOTPResponse>;
export declare const isValidPhoneNumber: (phoneNumber: string) => boolean;
export declare const formatPhoneNumber: (phoneNumber: string) => string;
//# sourceMappingURL=otpService.d.ts.map