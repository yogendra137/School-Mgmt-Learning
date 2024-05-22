import { Schema, model } from 'mongoose';
import { UserTokenModelInterface } from './interface';

const userTokenSchema = new Schema<UserTokenModelInterface>(
    {
        token: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        isUtilized: { type: Boolean, default: false },
        tokenType: { type: String, default: 'FP' },
    },
    {
        timestamps: true,
    },
);

export default model<UserTokenModelInterface>('usersToken', userTokenSchema);
