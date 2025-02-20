import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  image: { type: String, required: true },
  expiresAt: { 
    type: Date, 
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
  }
}, { timestamps: true });

// Index for automatic deletion after expiration
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model('Story', storySchema);
export default Story;
