import { Schema, model } from "mongoose";
import { UserModelInterface } from "./interface";

const userSchema = new Schema<UserModelInterface>({
    email: { type: String, default: "" },
    mobile: { type: Number, default: null },
    password: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    createdAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" }
});

export default model<UserModelInterface>("User", userSchema);
