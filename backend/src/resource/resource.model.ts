import { Schema, model } from 'mongoose';
import { ResourceModelInterface } from './interface';

const resourceSchema = new Schema<ResourceModelInterface>(
    {
        fileName: { type: [String], default: null },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        tags: { type: [String], default: null },
        isActive: { type: Boolean },
        createdBy: { type: String, default: null },
        updatedBy: { type: String, default: null },
    },
    {
        timestamps: true,
    },
);

export default model<ResourceModelInterface>('Resource', resourceSchema);
