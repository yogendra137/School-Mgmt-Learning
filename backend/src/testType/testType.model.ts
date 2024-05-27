import { Schema, model } from 'mongoose';
import { TestModelInterface } from './interface';

const testSchema = new Schema<TestModelInterface>(
    {
        testName: { type: String },
        skills: { type: [String] },
        description: { type: String },
        duration: { type: String },
        isActive: { type: Boolean },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: String, default: null },
        updatedBy: { type: String, default: null },
    },
    {
        timestamps: true,
    },
);

export default model<TestModelInterface>('Test', testSchema);
