import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { deleteStory } from '../store/slices/storySlice';

const StoryViewer = ({ stories, onClose, initialUserIndex = 0  }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // Ensure stories data exists and has the correct structure
  if (!stories || !Array.isArray(stories)) {
    console.error('Invalid stories data:', stories);
    return null;
  }

  const currentUserStories = stories[currentUserIndex];
  const currentStory = currentUserStories?.stories[currentStoryIndex];
  const isCurrentUser = currentUserStories?.user._id === user?._id;

  // Format timestamp
  const formatTimestamp = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    // More than 24 hours
    return date.toLocaleDateString();
  };

  const handleNext = useCallback(() => {
    if (currentStoryIndex < currentUserStories.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  }, [currentStoryIndex, currentUserIndex, currentUserStories, stories, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      const previousUserStories = stories[currentUserIndex - 1].stories;
      setCurrentStoryIndex(previousUserStories.length - 1);
    }
  }, [currentStoryIndex, currentUserIndex, stories]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // Swipe left
      } else {
        handlePrevious(); // Swipe right
      }
    }
    
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext, onClose]);

  // Auto-advance timer with pause functionality
  useEffect(() => {
    if (!isPaused) {
      const timer = setTimeout(() => {
        handleNext();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentUserIndex, currentStoryIndex, isPaused, handleNext]);

  const handleDelete = async () => {
    if (isCurrentUser && currentStory) {
      await dispatch(deleteStory(currentStory._id));
      
      if (currentUserStories.stories.length === 1) {
        if (stories.length === 1) {
          onClose();
        } else {
          handleNext();
        }
      } else {
        handleNext();
      }
    }
  };

  if (!currentUserStories || !currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {currentUserIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {currentUserIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}

      <div 
        className="relative max-w-lg w-full mx-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        // onMouseEnter={() => setIsPaused(true)}
        // onMouseLeave={() => setIsPaused(false)}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2">
          {currentUserStories.stories.map((_, index) => (
            <div
              key={index}
              className="h-0.5 flex-1 bg-gray-400 overflow-hidden"
            >
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  index < currentStoryIndex ? 'w-full' : 
                  index === currentStoryIndex ? 'w-full animate-progress' : 'w-0'
                } ${isPaused ? 'animation-pause' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* User info and timestamp */}
        <div className="absolute top-4 left-4 flex items-center justify-between w-full pr-16 z-10">
          <div className="flex items-center space-x-2">
            <img
              src={currentUserStories.user.image}
              alt={currentUserStories.user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white font-semibold">
              {currentUserStories.user.name}
            </span>
          </div>
          <span className="text-white text-sm">
            {formatTimestamp(currentStory.createdAt)}
          </span>
        </div>

        {/* Story image */}
        <img
          src={currentStory.image}
          alt="Story"
          className="w-full h-[calc(100vh-100px)] object-contain"
        />

        {/* Delete button for user's own stories */}
        {isCurrentUser && (
          <button
            onClick={handleDelete}
            className="absolute bottom-4 right-4 text-red-500 bg-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;