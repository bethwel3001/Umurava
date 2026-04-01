import { Request, Response } from 'express';
import Applicant from '../models/Applicant.js';
import Job from '../models/Job.js';
import ScreeningResult from '../models/ScreeningResult.js';
import geminiService from '../services/gemini.service.js';
import { PDFParse } from 'pdf-parse';

export class ApplicantController {
  async uploadResume(req: Request, res: Response) {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      
      const parser = new PDFParse({ data: req.file.buffer });
      const data = await parser.getText();
      const resumeText = data.text;
      
      const parsedData = await geminiService.parseResume(resumeText);
      res.status(200).json({ text: resumeText, parsedData });
    } catch (error: any) {
      console.error('Upload Error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async createApplicant(req: Request, res: Response) {
    try {
      const applicant = new Applicant(req.body);
      await applicant.save();
      res.status(201).json(applicant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getApplicants(req: Request, res: Response) {
    try {
      const applicants = await Applicant.find().sort({ createdAt: -1 });
      res.status(200).json(applicants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getApplicantById(req: Request, res: Response) {
    try {
      const applicant = await Applicant.findById(req.params.id);
      if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
      res.status(200).json(applicant);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async screenApplicants(req: Request, res: Response) {
    try {
      const { jobId, applicantIds } = req.body;
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: 'Job not found' });

      const applicants = await Applicant.find({ _id: { $in: applicantIds } });
      if (applicants.length === 0) return res.status(404).json({ message: 'No applicants found' });

      // Format candidates for Gemini
      const candidates = applicants.map(app => ({
        applicantId: app._id,
        name: app.name,
        profileData: app.profileData,
        parsedData: app.parsedData
      }));

      const screeningResults = await geminiService.screenCandidates(job, candidates);

      // Save results to DB
      const savedResults = await Promise.all(screeningResults.map(async (res) => {
        return await ScreeningResult.findOneAndUpdate(
          { jobId, applicantId: res.applicantId },
          { ...res, jobId },
          { upsert: true, new: true }
        );
      }));

      res.status(200).json(savedResults);
    } catch (error: any) {
      console.error('Screening Error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async parseResume(req: Request, res: Response) {
    try {
      const { resumeText } = req.body;
      if (!resumeText) return res.status(400).json({ message: 'Resume text is required' });

      const parsedData = await geminiService.parseResume(resumeText);
      res.status(200).json(parsedData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getScreeningResults(req: Request, res: Response) {
    try {
      const results = await ScreeningResult.find({ jobId: req.params.jobId })
        .populate('applicantId')
        .sort({ rank: 1 });
      res.status(200).json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ApplicantController();
