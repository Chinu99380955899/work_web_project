import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../utils/jwt';
import { IUser } from '../models/User';
export interface AuthenticatedRequest extends Request {
    user?: IUser;
    tokenPayload?: JWTPayload;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requirePermission: (...permissions: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireOwnership: (userIdField?: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireVerification: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const adminOnly: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const recruiterOrAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const authenticatedUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map