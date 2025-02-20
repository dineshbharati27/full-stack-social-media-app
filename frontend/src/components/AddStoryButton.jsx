import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStory } from '../store/slices/storySlice';

const AddStoryButton = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth || {});
  const { isLoading = false } = useSelector((state) => state.stories || {});

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await dispatch(createStory(file));
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center mr-2">
      <div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer relative"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        {user?.image ? (
          <div className="relative w-full h-full">
            <img
              src={user.image}
              alt="Profile"
              className="w-full h-full rounded-full object-cover opacity-60"
            />
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 sm:p-1">
              <span className="text-white text-sm sm:text-xl">+</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-500 text-lg sm:text-2xl">+</span>
        )}
      </div>
      <span className="text-[10px] sm:text-xs mt-1 text-gray-600">Add story</span>
    </div>

  );
};

export default AddStoryButton;