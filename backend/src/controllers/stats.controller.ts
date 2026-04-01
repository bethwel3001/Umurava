import { Request, Response } from 'express';
import Job from '../models/Job.js';
import Applicant from '../models/Applicant.js';
import ScreeningResult from '../models/ScreeningResult.js';

export class StatsController {
  async getDashboardStats(req: Request, res: Response) {
    try {
      const activeJobsCount = await Job.countDocuments({ status: 'Open' });
      const totalApplicantsCount = await Applicant.countDocuments();
      
      // Get screenings from today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const screenedTodayCount = await ScreeningResult.countDocuments({
        createdAt: { $gte: startOfDay }
      });

      // Simple average time to hire (placeholder logic or based on status changes if implemented)
      // For now, let's return a realistic placeholder or 0 if no data
      const avgTimeToHire = "14 days"; // This would require more complex tracking

      res.status(200).json({
        activeJobs: activeJobsCount,
        totalApplicants: totalApplicantsCount,
        screenedToday: screenedTodayCount,
        avgTimeToHire: avgTimeToHire
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new StatsController();
