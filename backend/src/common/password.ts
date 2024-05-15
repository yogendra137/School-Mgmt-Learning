import bcrypt from 'bcryptjs';
/**
 * Generates Hash of a password string
 */
const encryptPassword = async (password: any) => bcrypt.hashSync(password, 10);

export { encryptPassword };
