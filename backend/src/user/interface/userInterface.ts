interface UserModelInterface {
    email: String;
    mobileNo: Number;
    password: String;
    isActive: Boolean;
    userType: String;
    createdAt: Date;
    updatedAt: Date;
    createdBy: String;
    updatedBy: String;
    role: 'SA' | 'PC' | 'MC' | 'MP' | 'VO' | 'SC';
}
interface AddUserInterface {
    email: String;
    mobileNo: String;
    password: String;
    userType: String;
    createdBy: String;
    updatedBy: String;
}

export { UserModelInterface, AddUserInterface };
