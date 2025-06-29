// import multer from 'multer';
// import path from 'path';

// // multer module code
// const srcPath = path.resolve(__dirname, '../..');

// // Construct the upload path relative to the 'src' directory
// const uploadPath = path.join(srcPath, 'public/resources');
// const randomGenerate = Math.random().toString(36).slice(-5);

// const storage = multer.diskStorage({
//     destination: uploadPath,
//     filename(req, file, cb) {
//         try {
//             // cb(null, file.fieldname + '_' + Date.now() + randomGenerate + path.extname(file.originalname));
//             cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
//         } catch (err) {
//             console.log('error');
//         }
//     },
// });

// function sanitizeFile(file: Express.Multer.File, cb: multer.FileFilterCallback) {
//     // Define the allowed extensions and MIME types
//     const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.doc', '.docx', '.pdf', '.csv', '.webm'];
//     const allowedMimeTypes = [
//         'image/png',
//         'image/jpeg',
//         'image/jpg',
//         'image/gif',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'application/pdf',
//         'application/csv',
//         'text/csv',
//         'video/webm',
//     ];

//     // Check if the file extension and MIME type are allowed
//     const isAllowedExt = allowedExts.includes(path.extname(file.originalname).toLowerCase());
//     const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

//     if (isAllowedExt && isAllowedMimeType) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Error: File type not allowed!'));
//     }
// }

// const upload = multer({
//     storage,
//     fileFilter: (req, file, callback) => {
//         sanitizeFile(file, callback);
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 2, // 2mb file size
//     },
// });

// export default upload;

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const srcPath = path.resolve(__dirname, '../..');
const uploadPath = path.join(srcPath, 'public/resources');
const schoolUploadPath = path.join(srcPath, 'public/school');

// Create a directory if it doesn't exist
function createDirectoryIfNotExists(directory: string) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // This case is managing for when upload school logo
        const { contactEmail } = req.body; // assuming schoolId is sent in the body
        if (contactEmail) {
            // const schoolPath = path.join(schoolUploadPath);
            createDirectoryIfNotExists(schoolUploadPath);

            cb(null, schoolUploadPath);
        } else {
            createDirectoryIfNotExists(uploadPath);
            cb(null, uploadPath);
        }
    },
    filename: (req, file, cb) => {
        const randomGenerate = Math.random().toString(36).slice(-5);
        cb(null, randomGenerate + '_' + Date.now() + path.extname(file.originalname));
    },
});

function sanitizeFile(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const allowedExts = ['.png', '.jpg', '.doc', '.docx', '.pdf'];
    const allowedMimeTypes = ['image/png', 'image/jpg', 'application/msword', 'application/pdf', ,];

    const isAllowedExt = allowedExts.includes(path.extname(file.originalname).toLowerCase());
    const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb(new Error('Error: File type not allowed!'));
    }
}

const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 2, // 2mb file size
    },
});

export default upload;
