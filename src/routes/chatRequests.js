import express from 'express';
import { acceptRequest, declineRequest, listRequests, sendRequest } from '../controllers/chatRequests.js';
import { authenticate } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.use(authenticate);
router.post('/', sendRequest);             // send request
router.get('/', listRequests);             // list requests (filter ?status=)
router.post('/:id/accept', acceptRequest);
router.post('/:id/decline', declineRequest);

export default router;
