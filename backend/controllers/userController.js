const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const validator = require('validator')


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let image = '';
        // if (req.file) {
        //     const result = await cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
        //         if (error) return res.status(500).json({ message: 'Cloudinary upload failed' });
        //         avatar = result.secure_url;
        //     }).end(req.file.buffer);
        // }

        const exists = await User.findOne({email});
        if(exists){
            return res.json({success: false, message: "user already exists."})
        }
    
        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter the valid email."})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.json({sucess: true, message: 'User registered successfully' });
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
};

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        const user = await User.findOne({email})

        if (!user) {
            return res.json({success: false, message: "user does not exists."})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            const {password, ...withoutPassword} = user._doc;
            res.json({
                success: true, 
                user: withoutPassword,  
                token
            })
        } else {
            res.json({success: false, message: "invalid credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        const profileData = await User.findById(userId).select('-password');
        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        res.json({success: true, users})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const userId = req.userId;

        // Prepare the update object based on whether an image is provided
        let updateData = { name, bio };
        if (req.file) {
            updateData.image = req.file.path;
        }

        // Update user with the prepared data
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({ success: true, updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.followUser = async (req, res) => {
    try {
        const userToFollowId = req.params.userId;
        const currentUserId = req.userId;

        // Check if trying to follow self
        if (userToFollowId === currentUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const userToFollow = await User.findById(userToFollowId);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isFollowing = currentUser.following.includes(userToFollowId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id !== userToFollowId);
            userToFollow.followers = userToFollow.followers.filter(id => id !== currentUserId);
        } else {
            // Follow
            currentUser.following.push(userToFollowId);
            userToFollow.followers.push(currentUserId);
        }

        await Promise.all([currentUser.save(), userToFollow.save()]);

        // Return minimal data without re-fetching
        res.json({
            success: true,
            isFollowing: !isFollowing,
            currentUser: currentUser,
            userToFollow: userToFollow
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
