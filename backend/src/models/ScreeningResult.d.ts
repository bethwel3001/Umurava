import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IScreeningResult, {}, {}, {}, mongoose.Document<unknown, {}, IScreeningResult, {}, mongoose.DefaultSchemaOptions> & IScreeningResult & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IScreeningResult>;
export default _default;
//# sourceMappingURL=ScreeningResult.d.ts.map