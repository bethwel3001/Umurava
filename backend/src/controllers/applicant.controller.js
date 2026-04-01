"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantController = void 0;
const express_1 = require("express");
const Applicant_1 = __importDefault(require("../models/Applicant"));
const Job_1 = __importDefault(require("../models/Job"));
const ScreeningResult_1 = __importDefault(require("../models/ScreeningResult"));
const gemini_service_1 = __importDefault(require("../services/gemini.service"));
class ApplicantController {
    async createApplicant(req, res) {
        try {
            const applicant = new Applicant_1.default(req.body);
            await applicant.save();
            res.status(201).json(applicant);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getApplicants(req, res) {
        try {
            const applicants = await Applicant_1.default.find().sort({ createdAt: -1 });
            res.status(200).json(applicants);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async screenApplicants(req, res) {
        try {
            const { jobId, applicantIds } = req.body;
            const job = await Job_1.default.findById(jobId);
            if (!job)
                return res.status(404).json({ message: 'Job not found' });
            const applicants = await Applicant_1.default.find({ _id: { $in: applicantIds } });
            if (applicants.length === 0)
                return res.status(404).json({ message: 'No applicants found' });
            // Format candidates for Gemini
            const candidates = applicants.map(app => ({
                applicantId: app._id,
                name: app.name,
                profileData: app.profileData,
                parsedData: app.parsedData
            }));
            const screeningResults = await gemini_service_1.default.screenCandidates(job, candidates);
            // Save results to DB
            const savedResults = await Promise.all(screeningResults.map(async (res) => {
                return await ScreeningResult_1.default.findOneAndUpdate({ jobId, applicantId: res.applicantId }, { ...res, jobId }, { upsert: true, new: true });
            }));
            res.status(200).json(savedResults);
        }
        catch (error) {
            console.error('Screening Error:', error);
            res.status(500).json({ message: error.message });
        }
    }
    async parseResume(req, res) {
        try {
            const { resumeText } = req.body;
            if (!resumeText)
                return res.status(400).json({ message: 'Resume text is required' });
            const parsedData = await gemini_service_1.default.parseResume(resumeText);
            res.status(200).json(parsedData);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getScreeningResults(req, res) {
        try {
            const results = await ScreeningResult_1.default.find({ jobId: req.params.jobId })
                .populate('applicantId')
                .sort({ rank: 1 });
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.ApplicantController = ApplicantController;
exports.default = new ApplicantController();
//# sourceMappingURL=applicant.controller.js.map