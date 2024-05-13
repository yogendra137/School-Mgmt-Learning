interface UserModelInterface {
    email: String,
    mobile: Number,
    password: String,
    isActive: Boolean,
    createdAt: Date;
    updatedAt: Date;
    createdBy: String;
    updatedBy: String
}

interface AddUserInterface{
    email:String
}

export { UserModelInterface ,AddUserInterface }