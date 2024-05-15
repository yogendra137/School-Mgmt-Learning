import multer from 'multer';
import path from 'path';

// multer module code
const srcPath = path.resolve(__dirname, '../..');

// Construct the upload path relative to the 'src' directory
const uploadPath = path.join(srcPath, 'public/resources');

const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
        try {
            cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
        } catch (err) {
            console.log('error');
        }
    },
});

function sanitizeFile(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // Define the allowed extensions and MIME types
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.doc', '.docx', '.pdf', '.csv', '.webm'];
    const allowedMimeTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'application/csv',
        'text/csv',
        'video/webm',
    ];

    // Check if the file extension and MIME type are allowed
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
