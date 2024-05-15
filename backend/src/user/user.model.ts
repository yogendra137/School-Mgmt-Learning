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
        license: { type: String, default: null },
        medicalExpertise: { type: [String], default: [] },
        assignBootCamp: { type: [String], default: null }, // assign to MC
        assignMedicalPractitioner: { type: [String], default: null }, // assign to MP to MC
        isActive: { type: Boolean, default: false },
        createdBy: { type: String },
        updatedBy: { type: String },
    },
    {
        timestamps: true,
    },
);

export default model<UserModelInterface>('User', userSchema);
