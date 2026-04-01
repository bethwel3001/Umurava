"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
class GeminiService {
    model;
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    }
    /**
     * Parse unstructured resume text into structured profile data.
     */
    async parseResume(text) {
        const prompt = `
      Extract the following information from the resume text into a JSON format:
      - Name
      - Email
      - Phone
      - Skills (array of strings)
      - Experience (array of objects with title, company, duration, description)
      - Education (array of objects with degree, institution, year)
      - Summary

      Resume Text:
      ${text}

      Return ONLY the JSON object.
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const jsonStr = response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(jsonStr);
        }
        catch (error) {
            console.error('Gemini Parsing Error:', error);
            throw new Error('Failed to parse resume');
        }
    }
    /**
     * Screen multiple candidates against a job description.
     */
    async screenCandidates(jobDescription, candidates) {
        const prompt = `
      Job Description:
      Title: ${jobDescription.title}
      Description: ${jobDescription.description}
      Requirements: ${jobDescription.requirements.join(', ')}
      Skills Wanted: ${jobDescription.skills.join(', ')}

      Analyze the following candidates and rank them based on relevance to the job.
      For each candidate, provide:
      - Match Score (0-100)
      - Strengths (array of strings)
      - Gaps/Risks (array of strings)
      - Recommendation (e.g., Strongly Recommend, Recommended, Consider, Not Recommended)
      - Detailed Reasoning

      Candidates:
      ${JSON.stringify(candidates, null, 2)}

      Return the results as a JSON array of objects, each containing applicantId and the analyzed fields.
      Ensure the output is valid JSON and nothing else.
    `;
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const jsonStr = response.text().replace(/```json|```/g, '').trim();
            const results = JSON.parse(jsonStr);
            // Add rank based on score
            return results.sort((a, b) => b.matchScore - a.matchScore).map((res, index) => ({
                ...res,
                rank: index + 1
            }));
        }
        catch (error) {
            console.error('Gemini Screening Error:', error);
            throw new Error('Failed to screen candidates');
        }
    }
}
exports.GeminiService = GeminiService;
exports.default = new GeminiService();
//# sourceMappingURL=gemini.service.js.map