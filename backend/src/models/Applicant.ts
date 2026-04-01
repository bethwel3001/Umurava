import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant extends Document {
  name: string;
  email: string;
  phone?: string;
  profileData: Record<string, any>;
  resumeUrl?: string;
  parsedData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profileData: { type: Map, of: Schema.Types.Mixed, default: {} },
    resumeUrl: { type: String },
    parsedData: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model<IApplicant>('Applicant', ApplicantSchema);
