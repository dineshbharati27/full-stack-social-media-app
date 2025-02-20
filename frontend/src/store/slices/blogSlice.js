import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogs } from '../../services/api';
import toast from 'react-hot-toast';

const initialState = {
  blogs: [],
  userBlogs: [],
  isLoading: false,
  error: null,
};

export const getAllBlogs = createAsyncThunk(
  'blog/All',
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogs.getAll();
      if (response.data.success) {
        return response.data.blogs
      } else {
       toast.error("error in the server to fetch blogs") 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getMyBlogs = createAsyncThunk(
  'blog/getMyBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogs.getMyBlogs();
      return response.data.blogs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/create',
  async ({ title, description, category, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('image', image);
      const response = await blogs.create(formData);
      if(response.data.success){
        toast.success('Blog created successfully!');
      } else {
        toast.error(response.message)
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/delete',
  async (id, { rejectWithValue }) => {
    try {
      await blogs.delete(id);
      toast.success('Blog deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/update',
  async ({ id, blogData }, { rejectWithValue }) => {  // Changed 'data' to 'blogData' for consistency
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('description', blogData.description);
      formData.append('category', blogData.category);
      if (blogData.image) {
        formData.append('image', blogData.image);
      }

      const response = await blogs.update(id, formData);
      if(response.data.success){
        toast.success('Blog updated successfully!');
        return response.data;
      } else {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const commentBlog = createAsyncThunk(
  'blog/comment',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await blogs.comment(id, text);
      if (response.data.success) {
        return response.data.blog;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blog/like',
  async (id, { rejectWithValue }) => {
    try {
      const response = await blogs.like(id);
      if(response.data.success){
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);









const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getMyBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = action.payload;
      })
      .addCase(getMyBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = [...state.userBlogs, action.payload.blog];
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = state.userBlogs.filter(blog => blog._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBlogs = state.userBlogs.map(blog => blog._id === action.payload.blog._id ? action.payload.blog : blog); 

      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(commentBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(commentBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update both blogs and userBlogs arrays
        state.blogs = state.blogs.map(blog => 
          blog._id === action.payload._id ? action.payload : blog
        );
        state.userBlogs = state.userBlogs.map(blog => 
          blog._id === action.payload._id ? action.payload : blog
        );
      })
      .addCase(commentBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(likeBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        //update the blog in the blogs array
        const  {blogId, likes} = action.payload;
        // Update in main blogs array
        const blogIndex = state.blogs.findIndex(blog => blog._id === blogId);
        if (blogIndex !== -1) {
          state.blogs[blogIndex].likes = likes;
        }
        // Update in userBlogs array
        const userBlogIndex = state.userBlogs.findIndex(blog => blog._id === blogId);
        if (userBlogIndex !== -1) {
          state.userBlogs[userBlogIndex].likes = likes;
        }
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })  
  },
});


export default blogSlice.reducer;
