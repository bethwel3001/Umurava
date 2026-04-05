import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import jobRoutes from './routes/job.routes.js';
import applicantRoutes from './routes/applicant.routes.js';
import statsRoutes from './routes/stats.routes.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('UMU AI Backend API');
});

app.get('/api/test-direct', (req, res) => res.json({ message: 'Direct success' }));
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/stats', statsRoutes);

// Start Server
app.listen(Number(port), '0.0.0.0', () => {
  console.log(`[server]: Server is running at http://0.0.0.0:${port}`);
});
