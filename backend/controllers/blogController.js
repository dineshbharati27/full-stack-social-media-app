const Blog = require('../models/Blog');
const User = require('../models/User')


exports.createBlog = async (req, res) => {
    try {
        // Check if the image file is present
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const { title, description, category } = req.body;
        const userId = req.userId;
        if(!userId || !title || !description || !category){
            return res.json({ success: false, message: "Missing Details"})
        }

        const image = req.file.path;
        
        const blog = new Blog({
            title,
            description,
            image,
            category,
            userId,
        });
        await blog.save();
        res.json({success: true, blog});
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
};

exports.getUserBlogs = async (req, res) => {
    try {
        const userId = req.userId;
        const blogs = await Blog.find({ userId: userId }).sort({ createdAt: -1 })
        res.json({success: true, blogs});
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
    
};

exports.updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const blog = await Blog.findOne({ _id: id, userId: userId });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found or unauthorized" });
        }

        const { title, description, category } = req.body;
        blog.title = title;
        blog.description = description;
        blog.category = category;
        if(req.file){
            blog.image = req.file.path;
        }

        if(!title || !description || !category){
            return res.json({success: false, message: "Missing Details"})
        }
        
        await blog.save();
        res.json({ success: true, blog });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const blog = await Blog.findOne({ _id: id, userId: userId });

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found or unauthorized" });
        }

        await Blog.deleteOne({ _id: id });
        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        if (!blogs.length) {
            return res.status(404).json({ success: false, message: "No blogs found" });
        }
        res.json({success: true, blogs});
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
};

exports.likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.userId;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        if (blog.likes.includes(userId)) {
            blog.likes = blog.likes.filter((id) => id !== userId);
        } else {
            blog.likes.push(userId);
        }
        await blog.save();
        res.json({success: true, 
            data: {
                blogId: blog._id,
                likes: blog.likes,
            }
        });
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
};

exports.commentBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.userId;
        const { text } = req.body;
        
        const blog = await Blog.findById(blogId);
            
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        
        blog.comments.push({ userId, text });
        await blog.save();
        
        // Fetch the updated blog with populated data
        const updatedBlog = await Blog.findById(blogId)
            .populate('userId', 'name image')
            .populate('comments.userId', 'name image')
            .populate('likes', 'name image');
            
        res.json({ 
            success: true, 
            blog: updatedBlog 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};