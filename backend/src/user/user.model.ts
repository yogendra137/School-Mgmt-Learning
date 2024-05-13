import { Schema, model } from 'mongoose';
import { UserModelInterface } from './interface';

const userRoles = [
    'superAdmin',
    'projectCoordinator',
    'medicalCoordinator',
    'schoolCoordinator',
    'medicalPractitioners',
];

const userSchema = new Schema<UserModelInterface>({
    email: { type: String, default: '' },
    mobileNo: { type: String, default: null },
    password: { type: String, default: '' },
    userType: { type: String, enum: userRoles, default: '' },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
    createdBy: { type: String, default: '' },
    updatedBy: { type: String, default: '' },
});

export default model<UserModelInterface>('User', userSchema);
