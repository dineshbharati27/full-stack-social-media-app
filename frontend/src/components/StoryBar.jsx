import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStories } from '../store/slices/storySlice';
import AddStoryButton from './AddStoryButton';

const StoriesBar = ({ onStoryClick }) => {
  const dispatch = useDispatch();
  const { stories, isLoading, error } = useSelector((state) => state.story);
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    dispatch(getStories());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex space-x-4 p-4 overflow-x-auto bg-white rounded-lg shadow-sm">
        <div className="animate-pulse flex space-x-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-16 h-16 rounded-full bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  // Add error handling
  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading stories: {error}
      </div>
    );
  }

  // Add empty state handling
  if (!stories || stories.length === 0) {
    return (
      <div className="flex space-x-4 p-4 overflow-x-auto bg-white rounded-lg shadow-sm">
        <AddStoryButton />
        <div className="text-gray-500">No stories available</div>
      </div>
    );
  }

  // Rest of the component remains the same
  return (
    <div className="flex space-x-2 sm:space-x-4 p-2 sm:p-4 overflow-x-auto bg-white rounded-lg shadow-sm">
      <AddStoryButton />
      
      {stories.map((userStories, index) => (
        <div
          key={userStories.user._id}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onStoryClick(userStories, index)}  // Pass the index here
        >
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 ${
            userStories.stories.some(story => !story.viewed)
              ? 'ring-blue-500'
              : 'ring-gray-300'
          } p-0.5 sm:p-1`}>
            <img
              src={userStories.user.image}
              alt={userStories.user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-[10px] sm:text-xs mt-1 text-gray-600">
            {userStories.user._id === user?._id ? 'Your story' : userStories.user.name}
          </span>
        </div>
      ))}
    </div>

  );
};

export default StoriesBar;