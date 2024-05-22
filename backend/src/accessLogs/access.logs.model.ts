import { Schema, model } from 'mongoose';
import { AccessLogsModelInterface } from './interface';

const accessLogsSchema = new Schema<AccessLogsModelInterface>(
    {
        userId: { type: String, default: null },
        loginDateAndTime: { type: Date, default: null },
        loginIp: { type: String, default: '' },
        loginPlatform: { type: String, default: null },
    },
    {
        timestamps: true,
    },
);

export default model<AccessLogsModelInterface>('AccessLogs', accessLogsSchema);
