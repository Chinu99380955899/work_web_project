import jwt from "jsonwebtoken";
import { ApiError } from "../middleware/errorHandler";

export interface JWTPayload {
  userId: string;
  phoneNumber: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">
): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT secret not configured");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  
  // Explicitly type the options object
  const options = { expiresIn } as jwt.SignOptions;
  
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT secret not configured");
  }

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token expired. Please log in again.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token. Please log in again.");
    } else {
      throw new ApiError(
        401,
        "Token verification failed. Please log in again."
      );
    }
  }
};

export const extractTokenFromHeader = (
  authHeader: string | undefined
): string => {
  if (!authHeader) {
    throw new ApiError(401, "Authorization header not provided");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Invalid authorization header format");
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (!token) {
    throw new ApiError(401, "Token not provided");
  }

  return token;
};