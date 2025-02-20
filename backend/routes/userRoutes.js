const express = require('express');
const { registerUser, loginUser, getUserProfile, getUsers, followUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/all', authMiddleware, getUsers);
router.post('/follow/:userId', authMiddleware, followUser);
router.put('/update', authMiddleware, upload.single('image'), updateUser);


module.exports = router;