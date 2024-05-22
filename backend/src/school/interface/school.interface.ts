interface SchoolModelInterface {
    schoolName: string;
    contactPerson: string;
    contactEmail: string;
    contactNumber: string;
    location: object;
    isActive: boolean;
    schoolLogo: string;
    createdBy: string;
    updatedBy: string;
}

interface AddSchoolInterface {
    body: {
        schoolName: string;
        contactPerson: string;
        contactEmail: string;
        contactNumber: string;
        schoolLogo: string;
        city: string;
        state: string;
        country: string;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    };
    user: {
        _id: string;
        email: string;
        userType: string;
    };
    file: any;
}

export { SchoolModelInterface, AddSchoolInterface };
