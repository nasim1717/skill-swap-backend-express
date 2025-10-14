import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);

export default router;
