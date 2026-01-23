import multer from "multer";
import path from "path";
import fs from 'fs';

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const createUploader = (folder = '') => {
    const uploadPath = path.join("uploads", folder);
    ensureDir(uploadPath);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });

    const upload = multer({ storage: storage });
    return upload;
}

export { createUploader };