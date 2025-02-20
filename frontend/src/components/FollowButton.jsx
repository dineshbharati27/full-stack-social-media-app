import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { followUser } from '../store/slices/authSlice';

const FollowButton = ({ userId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    useEffect(() => {
        if (user?.following) {
            setIsFollowing(user.following.includes(userId));
        }
    }, [user?.following, userId]);

    const handleFollow = async () => {
        if (!user) return;
        setIsLocalLoading(true);
        await dispatch(followUser(userId));
        setIsLocalLoading(false);
    };

    if (user?._id === userId) return null;

    return (
        <button
            onClick={handleFollow}
            disabled={isLocalLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                ${isFollowing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'} 
                transition-colors duration-200 ease-in-out`}
        >
            {isLocalLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;