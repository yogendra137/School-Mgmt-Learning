import { Schema, model } from 'mongoose';
import { SchoolModelInterface } from './interface';

const schoolSchema = new Schema<SchoolModelInterface>(
    {
        schoolName: { type: String },
        contactPerson: { type: String }, // school Representative name
        contactEmail: { type: String },
        contactNumber: { type: String },
        location: {
            city: { type: String },
            state: { type: String },
            country: { type: String },
        },
        isActive: { type: Boolean },
        createdBy: { type: String },
        updatedBy: { type: String },
    },
    {
        timestamps: true,
    },
);

export default model<SchoolModelInterface>('School', schoolSchema);
