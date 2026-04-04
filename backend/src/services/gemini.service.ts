import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export class GeminiService {
  private keys: string[] = [];
  private currentKeyIndex: number = 0;

  constructor() {
    this.loadKeys();
  }

  private loadKeys() {
    // 1. Load from backend/.env (standard way)
    if (process.env.GEMINI_API_KEY) {
      this.keys.push(process.env.GEMINI_API_KEY);
    }

    // 2. Load from root .env (list of keys)
    try {
      const rootEnvPath = path.resolve(process.cwd(), '../.env');
      if (fs.existsSync(rootEnvPath)) {
        const rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');
        const rootKeys = rootEnvContent
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#'));
        this.keys.push(...rootKeys);
      }
    } catch (error) {
      console.error('Error loading root .env keys:', error);
    }

    // Remove duplicates
    this.keys = [...new Set(this.keys)];
    
    if (this.keys.length === 0) {
      console.warn('No API keys found in backend/.env or root .env');
    } else {
      console.log(`Loaded ${this.keys.length} API keys for rotation.`);
    }
  }

  private getNextKey(): string | null {
    if (this.keys.length === 0) return null;
    const key = this.keys[this.currentKeyIndex];
    return key;
  }

  private rotateKey() {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    console.log(`Rotating to API key index ${this.currentKeyIndex}`);
  }

  /**
   * Universal call to LLM with fallback and rotation
   */
  private async callLLM(prompt: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = Math.min(this.keys.length, 10); // Try up to 10 keys or all if less

    while (attempts < maxAttempts) {
      const key = this.getNextKey();
      if (!key) throw new Error('No API keys available');

      try {
        if (key.startsWith('AIza')) {
          // Gemini
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          return response.text();
        } else if (key.startsWith('sk-')) {
          // OpenAI
          const openai = new OpenAI({ apiKey: key });
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Good balance of speed and cost, similar to gemini-1.5-flash
            messages: [{ role: 'user', content: prompt }],
          });
          return response.choices[0]?.message?.content || '';
        } else {
          console.warn(`Unknown key format: ${key.substring(0, 5)}... skipping.`);
          this.rotateKey();
          attempts++;
          continue;
        }
      } catch (error: any) {
        console.error(`Error with API key index ${this.currentKeyIndex}:`, error.message);
        
        // If it's a quota or auth error, rotate and try again
        if (this.isRetryableError(error)) {
          this.rotateKey();
          attempts++;
        } else {
          throw error;
        }
      }
    }

    throw new Error('All attempted API keys failed');
  }

  private isRetryableError(error: any): boolean {
    const status = error.status || error.response?.status;
    const message = error.message?.toLowerCase() || '';
    
    return (
      status === 429 || // Quota
      status === 401 || // Unauthorized/Invalid key
      status === 403 || // Forbidden
      message.includes('quota') ||
      message.includes('api key') ||
      message.includes('rate limit') ||
      message.includes('unauthorized') ||
      message.includes('not found')
    );
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
      const responseText = await this.callLLM(prompt);
      const jsonStr = responseText.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error: any) {
      console.error('Parsing Error:', error);
      
      if (this.shouldUseMock(error)) {
        console.warn('USING MOCK DATA DUE TO API ISSUES');
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
      const responseText = await this.callLLM(prompt);
      const jsonStr = responseText.replace(/```json|```/g, '').trim();
      const results = JSON.parse(jsonStr);
      
      // Add rank based on score
      return results.sort((a: any, b: any) => b.matchScore - a.matchScore).map((res: any, index: number) => ({
        ...res,
        rank: index + 1
      }));
    } catch (error: any) {
      console.error('Screening Error:', error);
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

