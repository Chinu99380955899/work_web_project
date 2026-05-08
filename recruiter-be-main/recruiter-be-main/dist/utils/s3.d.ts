export declare const uploadFile: (file: Express.Multer.File, folder?: string) => Promise<string>;
export declare const deleteFile: (fileUrl: string) => Promise<void>;
export declare const getSignedUrl: (fileUrl: string, expiresIn?: number) => Promise<string>;
export declare const uploadCSV: (file: Express.Multer.File, folder?: string) => Promise<string>;
export declare const uploadResume: (file: Express.Multer.File, folder?: string) => Promise<string>;
//# sourceMappingURL=s3.d.ts.map