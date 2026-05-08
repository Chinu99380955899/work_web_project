interface ProcessSummary {
    total: number;
    successful: number;
    failed: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
}
export declare const processCSV: (buffer: Buffer, resumeFiles?: {
    [key: string]: Express.Multer.File;
}) => Promise<ProcessSummary>;
export declare const exportToCSV: (candidates: any[], trackerFields: any[]) => Promise<string>;
export {};
//# sourceMappingURL=csvService.d.ts.map