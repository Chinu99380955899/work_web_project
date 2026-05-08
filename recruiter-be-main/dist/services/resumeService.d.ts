interface ParsedResumeData {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    experience?: string;
    education?: string[];
    summary?: string;
}
export declare const parseResume: (file: Express.Multer.File) => Promise<ParsedResumeData>;
export {};
//# sourceMappingURL=resumeService.d.ts.map