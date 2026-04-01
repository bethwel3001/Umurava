"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const express_1 = require("express");
const Job_1 = __importDefault(require("../models/Job"));
const Applicant_1 = __importDefault(require("../models/Applicant"));
const ScreeningResult_1 = __importDefault(require("../models/ScreeningResult"));
class StatsController {
    async getDashboardStats(req, res) {
        try {
            const activeJobsCount = await Job_1.default.countDocuments({ status: 'Open' });
            const totalApplicantsCount = await Applicant_1.default.countDocuments();
            // Get screenings from today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const screenedTodayCount = await ScreeningResult_1.default.countDocuments({
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
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.StatsController = StatsController;
exports.default = new StatsController();
//# sourceMappingURL=stats.controller.js.map