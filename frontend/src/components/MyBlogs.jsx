import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyBlogs, deleteBlog } from '../store/slices/blogSlice';
import { PlusCircle, Calendar, ThumbsUp, MessageCircle, Share, XCircle, Edit } from 'lucide-react';
import BlogCard from './BlogCard';

const MyBlogs = () => {
  const dispatch = useDispatch();
  const { userBlogs, isLoading } = useSelector((state) => state.blog);
  const { user, allUsers } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Load data only once when component mounts
  useEffect(() => {
    // Only fetch if we don't already have the data
    if (!userBlogs.length) {
      dispatch(getMyBlogs());
    }
  }, []); // Empty dependency array means it runs only once on mount


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
        await dispatch(deleteBlog(id));
    }
  };

  const handleEdit = async (id) => {
    navigate(`/home/edit/${id}`);
  };

  // Show loading state only on initial load
  if (isLoading && !userBlogs.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading your blogs...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">

        <div className="flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-8 lg:px-20 mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Blogs</h1>
          <Link
            to="/home/create"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Create New Blog
          </Link>
        </div>


        {userBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't created any blogs yet.</p>
            <Link
              to="/home/create"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <PlusCircle className="h-5 sm:h-8  w-5 sm:w-8 mr-2" />
              Create your first blog
            </Link>
          </div>
        ) : ( 
          <div className="mt-5 sm:mt-12 px-1 sm:px-6 md:px-8 lg:px-12 max-w-3xl mx-auto flex flex-col gap-4">
            {userBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} user={user} allUsers={allUsers} isMyBlog={true} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )} 
      </div>
    </div>
  );
};

export default MyBlogs;