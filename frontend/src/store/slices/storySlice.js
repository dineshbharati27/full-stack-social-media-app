import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stories } from '../../services/api';
import toast from 'react-hot-toast';

export const createStory = createAsyncThunk(
  'stories/create',
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await stories.create(formData);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("error in the story slice",error);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getStories = createAsyncThunk(
  'stories/getFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stories.getFeed();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteStory = createAsyncThunk(
  'stories/delete',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await stories.deleteStory(storyId);
      return { storyId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const storySlice = createSlice({
  name: 'stories',
  initialState: {
    stories: [],
    isLoading: false,
    createLoading: false,
    deleteLoading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Story
      .addCase(createStory.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.createLoading = false;
        const { story, user } = action.payload;
        
        // Find if user already has stories
        const existingUserStories = state.stories.find(
          item => item.user._id === user._id
        );
        
        if (existingUserStories) {
          existingUserStories.stories.unshift(story);
        } else {
          state.stories.unshift({
            user,
            stories: [story]
          });
        }
        toast.success('Story created successfully!');
      })
      .addCase(createStory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'An error occurred while creating the story';
        toast.error(state.error);
      })

      // Get Stories
      .addCase(getStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (!action.payload.stories) {
          state.stories = [];
          return;
        }
      
        state.stories = action.payload.stories.map(userStories => ({
          user: userStories.user,
          stories: userStories.stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        }));   
      })
      .addCase(getStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An error occurred while fetching stories';
      })

      // Delete Story
      .addCase(deleteStory.fulfilled, (state, action) => {
        const { storyId } = action.payload;
        // Remove the story from the state
        state.stories = state.stories.map(userStories => ({
          ...userStories,
          stories: userStories.stories.filter(story => story._id !== storyId)
        })).filter(userStories => userStories.stories.length > 0);
        toast.success('Story deleted successfully');
      });
  },
});

export default storySlice.reducer;