interface UserModelInterface {
    _id?: string;
    name: string;
    email: string;
    mobileNo: string;
    password: string;
    location: object;
    city: string;
    state: string;
    country: string;
    license: string;
    isActive: boolean;
    profilePic: string;
    haveSkills: string[];
    NotificationPreferences: boolean;
    schoolId: string;
    userType: string;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
}
interface AddUserInterface {
    body: {
        name: string;
        email: string;
        mobileNo: string;
        password: string;
        userType: string;
        SchoolID: string;
        haveSkills: string[];
        createdBy: string;
        updatedBy: string;
        createdAt: Date;
        updatedAt: Date;
    };
    user: {
        _id: string;
        userRole: string;
        userType: any;
    };
    params: {
        id: string;
    };
}

export { UserModelInterface, AddUserInterface };
