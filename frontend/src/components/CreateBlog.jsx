import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { createBlog, updateBlog } from '../store/slices/blogSlice'

const CreateBlog = () => {
  const { id } = useParams(); // Get blog ID if editing
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
  const { isLoading, userBlogs } = useSelector((state) => state.blog);

  // Load existing blog data if editing
  useEffect(() => {
    if (id) {
      const blogToEdit = userBlogs.find(blog => blog._id === id);
      if (blogToEdit) {
        setTitle(blogToEdit.title);
        setDescription(blogToEdit.description);
        setCategory(blogToEdit.category);
        setPreview(blogToEdit.image);
      }
    }
  }, [id, userBlogs]);

  // ... existing handleFileChange code ...

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed!");
        setImage(null);
        setPreview(null);
        return;
      }

      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (file.size > MAX_SIZE) {
        toast.error("Image size should be less than 2MB!");
        setImage(null);
        setPreview(null);
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!image && !id) {
      toast.error("Image required");
      return;
    }
  
    const blogData = {
      title,
      description,
      category,
      image: image || preview // Include existing image URL if no new image selected
    };
  
    try {
      let result;
      if (id) {
        result = await dispatch(updateBlog({ id, blogData })).unwrap();
        if (result.success) {
          navigate('/home/myblogs');
        }
      } else {
        result = await dispatch(createBlog(blogData)).unwrap();
        if (result.success) {
          navigate('/home/myblogs');
        }
      }
    } catch (error) {
      toast.error(error || 'Operation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          <PenSquare className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Blog' : 'Create New Blog'}
          </h1>
        </div>
        {/* ... rest of your existing form JSX ... */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* ... existing form fields ... */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-200 px-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description 
              </label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border px-3 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                Categories (comma-separated)
              </label>
              <input
                type="text"
                id="categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="technology, programming, web development"
                className="mt-1 block w-full rounded-md border px-3 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Update the image input to be optional when editing */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image {!id && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                id="image"
                onChange={handleFileChange}
                required={!id} // Only required for new blogs
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-700">Image Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {id ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;