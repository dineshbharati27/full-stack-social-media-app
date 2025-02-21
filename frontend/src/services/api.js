import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://full-stack-social-media-app-ten.vercel.app/api' : 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  getAllUser: () => api.get('/users/all'),
  updateUser: (data) => api.put('/users/update', data),
  followUser: (userId) => api.post(`/users/follow/${userId}`),
};

export const blogs = {
  getAll: () => api.get('/blogs/all'),
  getMyBlogs: () => api.get('/blogs/user'),
  create: (formData) => api.post('/blogs/create', formData),
  delete: (id) => api.delete(`/blogs/${id}`),
  update: (id, formData) => api.put(`/blogs/${id}`, formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  comment: (id, text) => api.put(`/blogs/comment/${id}`, { text }),
  like: (id) => api.put(`/blogs/like/${id}`),
};

export const stories = {
  create: (formData) => api.post('/stories/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFeed: () => api.get('/stories/feed'),
  delete: (id) => api.delete(`/stories/${id}`),
};

export const messages = {
  getMessages: (roomId) => api.get(`/messages/${roomId}`),
  sendMessage: (formData) => api.post('/messages/send', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};


export default api;