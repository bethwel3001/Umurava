# How UMU AI works

This guide explains the workflow and features of the UMU AI talent screening tool for its two primary user roles.

---

## 1. For recruiters

The platform serves as a high-efficiency **Recruiter console**, designed to reduce time-to-hire through intelligent automation while keeping the human in the loop.

### Workspace management
*   **Centralized dashboard**: View real-time analytics on active job openings, total candidate pool, and recent screening activity.
*   **Job lifecycle**: Create, edit, and manage job openings. Archive or end postings directly from the dashboard.

### Talent pool & ingestion
*   **AI resume parsing**: Recruiters can upload PDF resumes or paste raw text. Our engine instantly extracts structured data including contact info, skills, experience, and education.
*   **Candidate profiles**: Every parsed candidate is instantly synchronized to the talent pool with automated skill tagging.

### AI-powered screening
*   **Targeted evaluation**: Select a specific job and a batch of candidates to run a deep AI evaluation.
*   **Intelligent ranking**: The AI ranks candidates based on match score, connection to specific requirements, and potential risks.
*   **Explainable reasoning**: For every candidate, the AI provides a detailed reasoning summary to justify its recommendation.

---

## 2. Technical Integrity

### Robust AI Engine
*   **Failover mechanism**: The system automatically detects API failures or quota limits.
*   **Multi-model support**: Seamlessly switches between Google Gemini and OpenAI models to ensure continuous service.
*   **Key rotation**: Efficiently utilizes multiple API keys to maximize throughput.
