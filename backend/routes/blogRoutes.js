import express from 'express';
import { deleteBlog, createBlog, getUserBlogs, getAllBlogs, updateBlog, commentBlog, likeBlog } from '../controllers/blogController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';
const router = express.Router();

router.post('/create', authMiddleware, upload.single('image'), createBlog);
router.get('/user', authMiddleware, getUserBlogs);
router.get('/all', getAllBlogs);
router.delete('/:id', authMiddleware ,deleteBlog)
router.put('/:id', authMiddleware, upload.single('image'), updateBlog);
router.put('/comment/:id', authMiddleware, commentBlog);
router.put('/like/:id', authMiddleware, likeBlog);

export default router;