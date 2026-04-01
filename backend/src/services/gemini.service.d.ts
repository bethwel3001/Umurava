export declare class GeminiService {
    private model;
    constructor();
    /**
     * Parse unstructured resume text into structured profile data.
     */
    parseResume(text: string): Promise<any>;
    /**
     * Screen multiple candidates against a job description.
     */
    screenCandidates(jobDescription: any, candidates: any[]): Promise<any[]>;
}
declare const _default: GeminiService;
export default _default;
//# sourceMappingURL=gemini.service.d.ts.map