import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { getAllBlogs } from '../store/slices/blogSlice';
import { getAllUsers } from '../store/slices/authSlice';
import BlogCard from './BlogCard';

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' or 'accounts'
  const { blogs } = useSelector(state => state.blog);
  const { allUsers } = useSelector(state => state.auth);

  useEffect(() => {
    if (!blogs.length) {
      dispatch(getAllBlogs());
    }
    if (!allUsers?.length) {
      dispatch(getAllUsers());
    }
  }, []);

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = allUsers?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId) => {
    navigate(`/home/userprofile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Input */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search blogs or accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <SearchIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex gap-4 border-b">
          <button
            className={`pb-2 px-4 ${activeTab === 'blogs' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('blogs')}
          >
            Blogs
          </button>
          <button
            className={`pb-2 px-4 ${activeTab === 'accounts' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500'}`}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-3xl mx-auto">
        {activeTab === 'blogs' ? (
          // Blogs Results
          <div className="space-y-6">
            {searchTerm && filteredBlogs.length === 0 ? (
              <p className="text-center text-gray-500">No blogs found</p>
            ) : (
              filteredBlogs.map(blog =>{ 
                const user = allUsers.find(user => user._id === blog.userId.toString());
                return (
                <BlogCard 
                  key={blog._id} 
                  blog={blog} 
                  allUsers={allUsers}
                  user={user}
                />
              )})
            )}
          </div>
        ) : (
          // Accounts Results
          <div className="space-y-4">
            {searchTerm && filteredUsers?.length === 0 ? (
              <p className="text-center text-gray-500">No accounts found</p>
            ) : (
              filteredUsers?.map(user => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">View Profile</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;