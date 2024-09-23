import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

// Async thunks for CRUD operations

// Fetch all posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

// Add new post
export const addNewPost = createAsyncThunk('posts/addNewPost', async (newPost) => {
  const response = await axios.post(POSTS_URL, newPost);
  return response.data;
});

// Update existing post
export const updatePost = createAsyncThunk('posts/updatePost', async (post) => {
  const { id } = post;
  const response = await axios.put(`${POSTS_URL}/${id}`, post);
  return response.data;
});

// Delete post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId) => {
  await axios.delete(`${POSTS_URL}/${postId}`);
  return postId;
});

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id);
        state.posts[index] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export default postsSlice.reducer;
