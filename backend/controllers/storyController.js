const Story = require('../models/Story');
const User = require('../models/User');

// Create a new story
exports.createStory = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const userId = req.userId;
        const image = req.file.path;

        const story = new Story({
            userId,
            image,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Set expiration 24 hours from now
        });

        await story.save();
        res.json({ success: true, story });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get stories for user's feed
exports.getStories = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
        // Get stories from users that the current user follows and their own stories
        const stories = await Story.find({
            userId: { 
                $in: [...user.following, userId] 
            }
        })
        .sort({ createdAt: -1 })
        .lean();

        // Group stories by user
        const userIds = [...new Set(stories.map(story => story.userId))];
        const users = await User.find({ _id: { $in: userIds } }, 'name image');
        
        const groupedStories = userIds.map(userId => {
            const userStories = stories.filter(story => story.userId === userId);
            const userInfo = users.find(user => user._id.toString() === userId);
            return {
                user: userInfo,
                stories: userStories
            };
        });

        res.json({ success: true, stories: groupedStories });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a story
exports.deleteStory = async (req, res) => {
    try {
        const storyId = req.params.id;
        const userId = req.userId;

        const story = await Story.findOne({ _id: storyId, userId });
        
        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found or unauthorized" });
        }

        await Story.deleteOne({ _id: storyId });
        res.json({ success: true, message: "Story deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};