"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const trackerFieldSchema = new mongoose_1.Schema({
    candidateField: {
        type: String,
        required: true,
        trim: true,
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        required: true,
        min: 1,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
});
const trackerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
        trim: true,
    },
    fields: [trackerFieldSchema],
    isDefault: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    lastUsed: {
        type: Date,
    },
}, {
    timestamps: true,
});
trackerSchema.index({ createdBy: 1 });
trackerSchema.index({ name: 1 });
trackerSchema.index({ isDefault: 1 });
trackerSchema.index({ isActive: 1 });
trackerSchema.index({ usageCount: -1 });
trackerSchema.index({ createdBy: 1, isDefault: 1 }, {
    unique: true,
    partialFilterExpression: { isDefault: true }
});
exports.default = mongoose_1.default.model('Tracker', trackerSchema);
//# sourceMappingURL=Tracker.js.map