import express from 'express';
import { getMessages, listThreads, postMessage } from '../controllers/threads.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.use(authenticate);
router.get('/', listThreads);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', postMessage); // fallback

export default router;
