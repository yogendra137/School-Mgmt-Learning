interface SchoolModelInterface {
    schoolName: string;
    contactPerson: string;
    contactEmail: string;
    contactNumber: string;
    location: object;
    isActive: boolean;
    createdBy: string;
    updatedBy: string;
}

interface AddSchoolInterface {
    body: {
        schoolName: string;
        contactPerson: string;
        contactEmail: string;
        contactNumber: string;
        city: string;
        state: string;
        country: string;
        isActive: boolean;
        createdBy: string;
        updatedBy: string;
    };
}

export { SchoolModelInterface, AddSchoolInterface };
