import { Schema, model } from 'mongoose';
import { UserModelInterface } from './interface';
/**
 * SA SUPER ADMIN
 * PC PROJECT COORDINATOR
 * MC MEDICINE COORDINATOR
 * MP MEDICAL PRACTITIONER
 */
const userRoles = [
    'SA',
    'PC',
    'MC',
    'MP',
];

const userSchema = new Schema<UserModelInterface>({
    email: { type: String, default: '' },
    mobileNo: { type: String, default: null },
    password: { type: String, default: '' },
    userType: { type: String, enum: userRoles },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
    createdBy: { type: String },
    updatedBy: { type: String },
});

export default model<UserModelInterface>('User', userSchema);
