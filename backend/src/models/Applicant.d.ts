import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IApplicant, {}, {}, {}, mongoose.Document<unknown, {}, IApplicant, {}, mongoose.DefaultSchemaOptions> & IApplicant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IApplicant>;
export default _default;
//# sourceMappingURL=Applicant.d.ts.map