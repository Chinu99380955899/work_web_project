export interface JWTPayload {
    userId: string;
    phoneNumber: string;
    role: string;
    iat?: number;
    exp?: number;
}
export declare const generateToken: (payload: Omit<JWTPayload, "iat" | "exp">) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const extractTokenFromHeader: (authHeader: string | undefined) => string;
//# sourceMappingURL=jwt.d.ts.map