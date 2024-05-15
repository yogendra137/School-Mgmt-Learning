import { Schema, model } from 'mongoose';
import { TestModelInterface } from './interface';

const testSchema = new Schema<TestModelInterface>(
    {
        testName: { type: String },
        skills: { type: [String] },
        Description: { type: String },
        duration: { type: String },
        isActive: { type: Boolean },
        createdBy: { type: String },
        updatedBy: { type: String },
    },
    {
        timestamps: true,
    },
);

export default model<TestModelInterface>('Test', testSchema);
