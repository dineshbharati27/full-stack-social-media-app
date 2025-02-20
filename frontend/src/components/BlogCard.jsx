import React, { useState } from 'react';
import { Calendar, ThumbsUp, MessageCircle, Share, Edit, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { commentBlog, likeBlog } from '../store/slices/blogSlice';
import { all } from 'axios';


const BlogCard = ({ blog, allUsers, user, isMyBlog, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const currentUser = useSelector(state => state.auth.user);
  const isLiked = blog.likes?.includes(currentUser?._id);

  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const handleLike = () => {
    dispatch(likeBlog(blog._id));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      dispatch(commentBlog({ 
        id: blog._id, 
        text: newComment.trim() 
      }));
      setNewComment('');
    }
  };

  
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden p-4 relative">
      {/* Edit & Delete Buttons - Only show if isMyBlog is true */}

      {isMyBlog && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            className="text-gray-500 hover:text-blue-600"
            onClick={() => onEdit(blog._id)}
          >
            <Edit className="h-8 w-8 pt-2" />
          </button>
          <button 
            className="text-gray-500 hover:text-red-600"
            onClick={() => onDelete(blog._id)}
          >
            <XCircle className="h-8 w-8 pt-2" />
          </button>
        </div>
      )}

      {/* User Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          onClick={() => navigate(`/home/userprofile/${user._id}`)}
          src={user?.image || "/default-profile.png"}
          alt={user?.name || "Unknown User"}
          className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover cursor-pointer"
        />
        <div>
          <h3 
            onClick={() => navigate(`/home/userprofile/${user._id}`)} 
            className="text-sm md:text-lg font-semibold text-gray-900 cursor-pointer"
          >
            {user?.name || "Unknown User"}
          </h3>
          <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(blog.createdAt).toLocaleDateString('en-GB')}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {blog.category && (
                <span className="text-blue-600 font-medium">{blog.category}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{blog.title}</h2>
      <p className="text-gray-600 text-sm mb-2">
        {expanded ? blog.description : blog.description.slice(0, MAX_LENGTH) + '...'}
        {blog.description.length > MAX_LENGTH && (
          <button 
            className="text-blue-600 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </p>
      <img src={blog.image} alt={blog.title} className="w-full h-auto rounded-lg mt-2" />

      {/* Action Buttons */}
      <div className="mt-3 flex items-center justify-between text-gray-500 text-sm">
        <button 
          className={`flex items-center gap-1 ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'}`} 
          onClick={handleLike}
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>Like ({blog.likes?.length || 0})</span>
        </button>
        <button 
          className="flex items-center gap-1 hover:text-blue-600" 
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comment ({blog.comments?.length || 0})</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          <Share className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t pt-4">
          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {blog.comments?.slice().reverse().map((comment, index) => {
            const commentUser = allUsers.find(user => user._id === comment.userId);
            
            return (
              <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                <img
                  src={commentUser?.image || "/default-profile.png"}
                  alt={commentUser?.name || "Unknown User"}
                  className="h-8 w-8 rounded-full object-cover cursor-pointer"
                  onClick={() => navigate(`/home/userprofile/${commentUser?._id}`)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 
                      className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/home/userprofile/${commentUser._id}`)}
                    >
                      {commentUser?.name || "Unknown User"}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}
    </article>
  );
};

export default BlogCard;