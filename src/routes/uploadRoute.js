import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;
