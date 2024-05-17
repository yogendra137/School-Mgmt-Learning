import bcrypt from 'bcryptjs';
/**
 * Generates Hash of a password string
 */
const encryptPassword = async (password: any) => bcrypt.hashSync(password, 10);

const decipher = () => {
    const salt: string = process.env.SALT ?? 'SALT';
    const textToChars = (text: string): number[] => text.split('').map((c) => c.charCodeAt(0));
    const applySaltToChar = (code: number): number => textToChars(salt).reduce((a, b) => a ^ b, code);

    return (encoded: string): string =>
        encoded
            .match(/.{1,2}/g) // Match every 2 characters
            ?.map((hex) => parseInt(hex, 16)) // Convert hex to decimal
            .map(applySaltToChar) // Apply salt
            .map((charCode) => String.fromCharCode(charCode)) // Convert char code to string
            .join('') ?? ''; // Join the array into a string
};

export { decipher, encryptPassword };
