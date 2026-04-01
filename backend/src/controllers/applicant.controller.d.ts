import { Request, Response } from 'express';
export declare class ApplicantController {
    createApplicant(req: Request, res: Response): Promise<void>;
    getApplicants(req: Request, res: Response): Promise<void>;
    screenApplicants(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    parseResume(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getScreeningResults(req: Request, res: Response): Promise<void>;
}
declare const _default: ApplicantController;
export default _default;
//# sourceMappingURL=applicant.controller.d.ts.map