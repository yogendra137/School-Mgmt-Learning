import { Schema, model } from 'mongoose';
import { UserModelInterface } from './interface';
/**
 * SA SUPER ADMIN
 * PC PROJECT COORDINATOR
 * MC MEDICINE COORDINATOR
 * MP MEDICAL PRACTITIONER
 * VO VOLUNTEER
 * SC SCHOOL
 */
const userRoles = ['SA', 'PC', 'MC', 'MP', 'VO', 'SC'];

const userSchema = new Schema<UserModelInterface>(
    {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        mobileNo: { type: String, default: null },
        password: { type: String, default: '' },
        profilePic: { type: String, default: null },
        haveSkills: { type: [String], default: [] },
        userType: { type: String, enum: userRoles },
        schoolId: { type: String, default: null },
        location: {
            city: { type: String, default: null },
            state: { type: String, default: null },
        },
        NotificationPreferences: { type: Boolean, default: true },
        license: { type: String, default: null },
        isActive: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        createdBy: { type: String, default: null },
        updatedBy: { type: String, default: null },
    },
    {
        timestamps: true,
    },
);

export default model<UserModelInterface>('User', userSchema);
