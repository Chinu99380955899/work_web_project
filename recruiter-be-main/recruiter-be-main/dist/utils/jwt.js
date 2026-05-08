"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new errorHandler_1.ApiError(500, "JWT secret not configured");
    }
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new errorHandler_1.ApiError(500, "JWT secret not configured");
    }
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errorHandler_1.ApiError(401, "Token expired. Please log in again.");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errorHandler_1.ApiError(401, "Invalid token. Please log in again.");
        }
        else {
            throw new errorHandler_1.ApiError(401, "Token verification failed. Please log in again.");
        }
    }
};
exports.verifyToken = verifyToken;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        throw new errorHandler_1.ApiError(401, "Authorization header not provided");
    }
    if (!authHeader.startsWith("Bearer ")) {
        throw new errorHandler_1.ApiError(401, "Invalid authorization header format");
    }
    const token = authHeader.substring(7);
    if (!token) {
        throw new errorHandler_1.ApiError(401, "Token not provided");
    }
    return token;
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=jwt.js.map