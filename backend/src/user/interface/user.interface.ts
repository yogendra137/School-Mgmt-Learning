interface UserModelInterface {
    _id?: string;
    name: string;
    email: string;
    mobileNo: string;
    password: string;
    location: object;
    license: string;
    isActive: boolean;
    profilePic: string;
    haveSkills: string[];
    medicalExpertise: string[];
    assignBootCamp: string[];
    assignMedicalPractitioner: string[];
    schoolId: string;
    userType: string;
    createdBy: string;
    updatedBy: string;
}
interface AddUserInterface {
    body: {
        name: string;
        email: string;
        mobileNo: string;
        password: string;
        userType: string;
        haveSkills: string[];
        createdBy: string;
        updatedBy: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

export { UserModelInterface, AddUserInterface };
