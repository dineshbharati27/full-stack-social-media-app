const express = require('express');
const router = express.Router();
const { createStory, getStories, deleteStory } = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

router.post('/create', authMiddleware, upload.single('image'), createStory);
router.get('/feed', authMiddleware, getStories);
router.delete('/:id', authMiddleware, deleteStory);

module.exports = router;