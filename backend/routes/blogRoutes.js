const express = require('express');
const { deleteBlog, createBlog, getUserBlogs, getAllBlogs, updateBlog, commentBlog, likeBlog } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/create', authMiddleware, upload.single('image'), createBlog);
router.get('/user', authMiddleware, getUserBlogs);
router.get('/all', getAllBlogs);
router.delete('/:id', authMiddleware ,deleteBlog)
router.put('/:id', authMiddleware, upload.single('image'), updateBlog);
router.put('/comment/:id', authMiddleware, commentBlog);
router.put('/like/:id', authMiddleware, likeBlog);

module.exports = router;