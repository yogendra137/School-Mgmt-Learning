import { Schema, model } from 'mongoose';
import { TokenModelInterface } from './interface';

const tokenSchema = new Schema<TokenModelInterface>(
    {
        token: { type: String },
    },
    {
        timestamps: true,
    },
);

export default model<TokenModelInterface>('tokenHistory', tokenSchema);
