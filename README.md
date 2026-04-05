# UMU AI - Talent Screening Tool

UMU AI is an AI-powered talent profile screening tool built for the Human Resources industry. It uses Gemini AI (with OpenAI fallback) to analyze job requirements and shortlist candidates from both structured profiles and unstructured resumes.

## Features
- **Job Management**: Create and manage job openings with specific requirements and skills.
- **AI Resume Parsing**: Upload PDF resumes or paste unstructured text. Our AI extracts contact info, skills, experience, and education automatically.
- **Robust AI Engine**: Multi-key rotation and automatic fallback between Gemini and OpenAI models to ensure 100% uptime.
- **Intelligent Screening**: Screen multiple candidates against a job description using deep reasoning.
- **Ranked Shortlists**: View top candidates with match scores, strengths, gaps, and AI-generated reasoning.
- **Modern UI**: Clean, professional dashboard with Dark/Light mode support.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Redux Toolkit, Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **AI**: Google Gemini 1.5 Flash & OpenAI GPT-4o-mini.
- **Database**: MongoDB.

## Getting Started

### 1. Prerequisites
- Node.js (v20+)
- MongoDB (Running locally or an Atlas URI)
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))
- (Optional) OpenAI API Key

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MONGODB_URI and GEMINI_API_KEY
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Rotation logic
The system can load multiple API keys from `GEMINI_API_KEYS` (comma-separated) or a `.env` file in the root directory. It automatically rotates to the next key if a quota limit or error occurs.
