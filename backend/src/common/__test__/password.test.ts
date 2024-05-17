import { decipher } from '../password';

describe('decipher', () => {
    // Mock the environment variable
    const originalEnv = process.env;
    beforeEach(() => {
        process.env = { ...originalEnv, SALT: 'SALT' };
    });
    afterAll(() => {
        process.env = originalEnv;
    });

    it('should correctly decipher an encoded string', () => {
        // Define encoded string and expected deciphered string
        const encoded = '537C7F010A';
        const expectedDeciphered = 'Yvu\v\x00';

        // Call the decipher function
        const deciphered = decipher()(encoded);

        // Assert
        expect(deciphered).toBe(expectedDeciphered);
    });

    it('should return an empty string for empty input', () => {
        // Define empty encoded string
        const encoded = '';

        // Call the decipher function
        const deciphered = decipher()(encoded);

        // Assert
        expect(deciphered).toBe('');
    });

    it('should handle special characters gracefully', () => {
        // Define encoded string with special characters
        const encoded = '2B2C3D'; // Example: Encoded version of '++-/'

        // Call the decipher function
        const deciphered = decipher()(encoded);

        // Assert
        expect(deciphered).toBe('!&7');
    });
});
