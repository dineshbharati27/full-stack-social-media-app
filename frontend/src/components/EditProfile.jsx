import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {

  const user = useSelector((state) => state.auth.user);

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [image, setImage] = useState(user.image);
  const [previewImage, setPreviewImage] = useState(user.image);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  


  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can send 'name', 'bio', and 'image' to your backend here.
    const result = await dispatch(updateUser({ name, bio, image }));
    if (result) {
      navigate('/home/profile');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5 bg-white rounded-2xl shadow-lg">
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col space-y-4 p-5 pr-10 items-center">
      {/* Profile Image Preview */}
      <label htmlFor="imageUpload" className="cursor-pointer">
        <img
          className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-lg font-bold object-cover"
          src={previewImage}
          alt="profile preview"
        />
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* User Info Inputs */}
      <div className="w-full flex flex-col space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="border border-gray-300 rounded-lg p-2 text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write your bio..."
          rows="3"
          className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-6 flex space-x-4">
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save Changes
      </button>
      <button
        type="button"
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
      >
        Cancel
      </button>
    </div>
  </form>
</div>

  );
};

export default EditProfile;
