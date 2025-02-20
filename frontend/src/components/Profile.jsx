import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileView from './ProfileView';
import { getMyBlogs } from '../store/slices/blogSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { userBlogs, isLoading } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userBlogs.length) {
      dispatch(getMyBlogs());
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <ProfileView 
      user={user}
      blogs={userBlogs}
      isOwnProfile={true}
    />
  );
};

export default Profile;