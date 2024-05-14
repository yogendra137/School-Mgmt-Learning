import bcrypt from "bcryptjs";
/**
 * Generates Hash of a password string
 */
const encryptPassword = async (password: any) => bcrypt.hashSync(password, 10);

/**
 * Compare the password using bcryptjs algo
//  */
// const comparePassword = async (password, hash) =>
//   await bcrypt.compare(password, hash);

export { encryptPassword };