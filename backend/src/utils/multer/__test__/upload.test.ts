import multer from 'multer';
import path from 'path';
import fs from 'fs';
import upload from '../upload'; // Adjust this import according to your file structure

jest.mock('fs');
jest.mock('../upload');

describe('Multer Configuration', () => {
    let req: any;
    let file: any;
    let cb: any;

    beforeEach(() => {
        req = {
            body: {
                contactEmail: 'test@example.com',
            },
        };
        file = {
            originalname: 'test.png',
            mimetype: 'image/png',
        };
        cb = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Storage Destination', () => {
        it('should create the school directory if contactEmail is provided', () => {
            jest.spyOn(fs, 'existsSync').mockReturnValue(false);
            // jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});

            const storage = (upload as any).storage;
            storage.getDestination(req, file, cb);

            expect(fs.existsSync).toHaveBeenCalledWith(path.join(__dirname, '../../public/school'));
            expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(__dirname, '../../public/school'), { recursive: true });
            expect(cb).toHaveBeenCalledWith(null, path.join(__dirname, '../../public/school'));
        });

        it('should create the upload directory if contactEmail is not provided', () => {
            req.body.contactEmail = null;
            jest.spyOn(fs, 'existsSync').mockReturnValue(false);
            // jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {}) ;

            const storage = (upload as any).storage;
            storage.getDestination(req, file, cb);

            expect(fs.existsSync).toHaveBeenCalledWith(path.join(__dirname, '../../public/resources'));
            expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(__dirname, '../../public/resources'), {
                recursive: true,
            });
            expect(cb).toHaveBeenCalledWith(null, path.join(__dirname, '../../public/resources'));
        });
    });

    describe('Storage Filename', () => {
        it('should generate a correct filename', () => {
            const storage = (upload as any).storage;
            const randomGenerate = 'abcde';

            jest.spyOn(Math, 'random').mockReturnValue(0.12345);

            storage.getFilename(req, file, cb);

            const expectedFilename = `${randomGenerate}_${Date.now()}${path.extname(file.originalname)}`;
            expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(new RegExp(`^[a-z0-9]{5}_[0-9]+\\.png$`)));
        });
    });

    // describe('File Filter', () => {
    //     it('should allow files with valid extensions and mime types', () => {
    //         const file = {
    //             originalname: 'test.png',
    //             mimetype: 'image/png',
    //         };

    //         upload.fileFilter(req, file, cb);

    //         expect(cb).toHaveBeenCalledWith(null, true);
    //     });

    //     it('should reject files with invalid extensions', () => {
    //         const file = {
    //             originalname: 'test.exe',
    //             mimetype: 'application/octet-stream',
    //         };

    //         upload.fileFilter(req, file, cb);

    //         expect(cb).toHaveBeenCalledWith(new Error('Error: File type not allowed!'));
    //     });

    //     it('should reject files with invalid mime types', () => {
    //         const file = {
    //             originalname: 'test.png',
    //             mimetype: 'application/octet-stream',
    //         };

    //         upload.fileFilter(req, file, cb);

    //         expect(cb).toHaveBeenCalledWith(new Error('Error: File type not allowed!'));
    //     });
    // });
});
