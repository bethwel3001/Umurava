import mongoose, { Document } from 'mongoose';
export interface IJob extends Document {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
    experienceLevel: string;
    status: 'Open' | 'Closed';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, mongoose.DefaultSchemaOptions> & IJob & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IJob>;
export default _default;
//# sourceMappingURL=Job.d.ts.map