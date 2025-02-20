import express from 'express';
import { registerUser, loginUser, getUserProfile, getUsers, followUser, updateUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/all', authMiddleware, getUsers);
router.post('/follow/:userId', authMiddleware, followUser);
router.put('/update', authMiddleware, upload.single('image'), updateUser);

export default router;