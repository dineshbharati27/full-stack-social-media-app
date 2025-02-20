import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, getAllUsers } from '../store/slices/authSlice';
import BlogCard from './BlogCard';
import FollowButton from './FollowButton';

const ProfileView = ({ userId = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, allUsers, isLoading } = useSelector((state) => state.auth);
  const { userBlogs, blogs } = useSelector((state) => state.blog);
  
  const [profileData, setProfileData] = useState(null);
  const [profileBlogs, setProfileBlogs] = useState([]);
  const isCurrentUser = !userId;

  useEffect(() => {
    // Only fetch data on initial load
    if (isCurrentUser && !user) {
      dispatch(getProfile());
    } else if (!isCurrentUser && !allUsers) {
      dispatch(getAllUsers());
    }
  }, [dispatch, isCurrentUser, user, allUsers]);

  useEffect(() => {
    if (isCurrentUser && user) {
      setProfileData(user);
      setProfileBlogs(userBlogs);
    } else if (!isCurrentUser && allUsers) {
      const foundUser = allUsers.find(u => u._id === userId);
      setProfileData(foundUser);
      const userPosts = blogs.filter(blog => blog.userId.toString() === userId);
      setProfileBlogs(userPosts);
    }
  }, [isCurrentUser, user, allUsers, userId, userBlogs, blogs]);

  if (!profileData && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto m-2 sm:mt-10 p-4 sm:p-5 bg-white rounded-lg shadow-none sm:shadow-lg">
        <div className="flex sm:flex-row items-center justify-between sm:justify-start sm:items-start p-4 sm:p-5">
          {/* Profile Image */}
          <img 
            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300 object-cover"
            src={profileData.image} 
            alt={profileData.name}
          />
          
          {/* User Info */}
          <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
            <h2 className="text-md sm:text-2xl font-semibold text-gray-800">{profileData.name}</h2>
            <div className="flex justify-center sm:justify-start space-x-4 mt-2 text-sm sm:text-md text-gray-600">
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-800">{profileBlogs.length}</span>
                <span>Blogs</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-800">{profileData.followers.length}</span>
                <span>Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-800">{profileData.following.length}</span>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-2 px-4 sm:px-10 text-gray-700 text-left sm:text-left">
          <h3 className="text-lg font-medium">Bio</h3>
          <p className="mt-2 leading-relaxed">{profileData.bio}</p>
        </div>

        {/* Action Buttons */}
        {isCurrentUser ? (
          <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 px-4 sm:px-10">
            <Link 
              to="/home/editprofile" 
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Profile
            </Link>
            <button className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Share Profile
            </button>
          </div>
        ) : (
          <div className="mt-6 px-4 sm:px-10">
            <FollowButton userId={userId} />
          </div>
        )}
      </div>


      {/* Blogs Section */}
      <div className="mt-5 sm:mt-12 px-4 sm:px-6 md:px-8 lg:px-12 max-w-3xl mx-auto flex flex-col gap-4">
          {profileBlogs?.length > 0 ? (
              profileBlogs.map((blog) => (
                  <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                      user={profileData}
                      allUsers={allUsers}
                  />
              ))
          ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No blogs yet</p>
              </div>
          )}
      </div>
    </>
  );
};

export default ProfileView;