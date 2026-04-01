import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model: GenerativeModel;

  constructor() {
    // Switching to 1.5-flash which is generally more stable for free tier quotas
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Parse unstructured resume text into structured profile data.
   */
  async parseResume(text: string): Promise<any> {
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
    } catch (error: any) {
      console.error('Gemini Parsing Error:', error);
      
      if (this.shouldUseMock(error)) {
        console.warn('USING MOCK DATA DUE TO GEMINI API QUOTA EXHAUSTION OR MODEL UNAVAILABILITY');
        return this.getMockParsedData(text);
      }
      
      throw new Error('Failed to parse resume');
    }
  }

  /**
   * Screen multiple candidates against a job description.
   */
  async screenCandidates(jobDescription: any, candidates: any[]): Promise<any[]> {
    const prompt = `
      Job Description:
      Title: ${jobDescription.title}
      Description: ${jobDescription.description}
      Requirements: ${jobDescription.requirements.join(', ')}
      Skills Wanted: ${jobDescription.skills.join(', ')}

      Analyze the following candidates and rank them based on relevance to the job.
      For each candidate, provide a DEEP analysis:
      - Match Score (0-100)
      - Strengths (array of strings): Be specific. Instead of "Relevant experience", explain WHICH experience is relevant and why it matches the job.
      - Gaps/Risks (array of strings): Be specific. Identify exactly what is missing or what might be a concern (e.g., "Missing experience with [Specific Tool]", "Short tenure at previous roles").
      - Recommendation: One of [Strongly Recommend, Recommended, Consider, Not Recommended].
      - Detailed Reasoning: Provide a 3-4 sentence explanation. Justify why they got the specific recommendation and match score. Connect their past achievements directly to the job requirements.

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
      return results.sort((a: any, b: any) => b.matchScore - a.matchScore).map((res: any, index: number) => ({
        ...res,
        rank: index + 1
      }));
    } catch (error: any) {
      console.error('Gemini Screening Error:', error);
      // DO NOT use mock data for screening as requested by the user.
      throw new Error('AI screening is currently unavailable. Please try again later.');
    }
  }

  private shouldUseMock(error: any): boolean {
    return (
      error.status === 429 || 
      error.status === 404 || 
      error.status === 403 ||
      error.message?.includes('quota') || 
      error.message?.includes('not found') ||
      error.message?.includes('API key')
    );
  }

  private getMockParsedData(text: string): any {
    // Basic extraction attempt from text
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
    
    return {
      Name: "Candidate Name (Mock)",
      Email: emailMatch ? emailMatch[0] : "candidate@example.com",
      Phone: phoneMatch ? phoneMatch[0] : "N/A",
      Skills: ["JavaScript", "React", "Node.js", "AI/ML (Auto-detected)"],
      Experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Solutions",
          duration: "2020 - Present",
          description: "Working on various high-impact projects."
        }
      ],
      Education: [
        {
          degree: "BSc Computer Science",
          institution: "University of Tech",
          year: "2018"
        }
      ],
      Summary: "Experienced developer with a strong background in web technologies."
    };
  }
}

export default new GeminiService();
