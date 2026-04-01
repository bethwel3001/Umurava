"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const express_1 = require("express");
const Job_1 = __importDefault(require("../models/Job"));
class JobController {
    async createJob(req, res) {
        try {
            const job = new Job_1.default(req.body);
            await job.save();
            res.status(201).json(job);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getJobs(req, res) {
        try {
            const jobs = await Job_1.default.find().sort({ createdAt: -1 });
            res.status(200).json(jobs);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getJobById(req, res) {
        try {
            const job = await Job_1.default.findById(req.params.id);
            if (!job)
                return res.status(404).json({ message: 'Job not found' });
            res.status(200).json(job);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateJob(req, res) {
        try {
            const job = await Job_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!job)
                return res.status(404).json({ message: 'Job not found' });
            res.status(200).json(job);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteJob(req, res) {
        try {
            const job = await Job_1.default.findByIdAndDelete(req.params.id);
            if (!job)
                return res.status(404).json({ message: 'Job not found' });
            res.status(200).json({ message: 'Job deleted' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.JobController = JobController;
exports.default = new JobController();
//# sourceMappingURL=job.controller.js.map