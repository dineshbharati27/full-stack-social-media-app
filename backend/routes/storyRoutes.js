import express from 'express';
import { createStory, getStories, deleteStory } from '../controllers/storyController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/create', authMiddleware, upload.single('image'), createStory);
router.get('/feed', authMiddleware, getStories);
router.delete('/:id', authMiddleware, deleteStory);

export default router;