import React from 'react';
import { useParams } from 'react-router-dom';
import ProfileView from './ProfileView';

const UserProfile = () => {
  const { userId } = useParams();
  return <ProfileView userId={userId} />;
};

export default UserProfile;