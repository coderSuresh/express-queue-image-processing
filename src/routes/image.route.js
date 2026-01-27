import express from 'express';
import { createUploader } from '../middleware/upload.middleware.js';
import { pushToQueue } from '../controllers/image.controller.js';

const router = express.Router();

const upload = createUploader('images');

router.post('/', upload.single('image'), pushToQueue);

export default router;