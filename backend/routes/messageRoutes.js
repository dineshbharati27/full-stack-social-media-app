import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/:roomId', authMiddleware, getMessages);
router.post('/send', authMiddleware, upload.single('file'), sendMessage);

export default router;