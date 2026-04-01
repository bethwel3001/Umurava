import mongoose, { Schema, Document } from 'mongoose';

export interface IScreeningResult extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  rank: number;
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  reasoning: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScreeningResultSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantId: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
    rank: { type: Number, required: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    strengths: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    recommendation: { type: String, required: true },
    reasoning: { type: String, required: true },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per job and applicant
ScreeningResultSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export default mongoose.model<IScreeningResult>('ScreeningResult', ScreeningResultSchema);
