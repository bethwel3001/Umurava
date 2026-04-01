# UMU AI - Talent Screening Tool

UMU AI is an AI-powered talent profile screening tool built for the Human Resources industry. It uses Gemini AI to analyze job requirements and shortlist candidates from both structured profiles and unstructured resumes.

## Features
- **Job Management**: Create and manage job openings with specific requirements and skills.
- **AI Resume Parsing**: Paste unstructured resume text and let Gemini extract contact info, skills, experience, and education.
- **Intelligent Screening**: Screen multiple candidates against a job description using Gemini Pro.
- **Ranked Shortlists**: View top candidates with match scores, strengths, gaps, and AI-generated reasoning.
- **Modern UI**: Clean, professional dashboard built with Next.js and Tailwind CSS (following UMU design guidelines).

## Tech Stack
- **Frontend**: Next.js 14, Redux Toolkit, Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Mongoose.
- **AI**: Google Gemini Pro.
- **Database**: MongoDB.

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or an Atlas URI)
- Gemini API Key ([Get one here](https://aistudio.google.com/))

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

## Design Specifications (from GEMINI.md)
- **Primary Color**: #1E3A8A (Deep Blue)
- **Secondary Color**: #14B8A6 (Teal)
- **Accent Color**: #F59E0B (Amber)
- **Fonts**: Inter, Poppins, Roboto Mono.
