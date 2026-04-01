import { Request, Response } from 'express';
export declare class JobController {
    createJob(req: Request, res: Response): Promise<void>;
    getJobs(req: Request, res: Response): Promise<void>;
    getJobById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateJob(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteJob(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: JobController;
export default _default;
//# sourceMappingURL=job.controller.d.ts.map