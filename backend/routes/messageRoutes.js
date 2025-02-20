const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

router.get('/:roomId', authMiddleware, getMessages);
router.post('/send', authMiddleware, upload.single('file'), sendMessage);

module.exports = router;