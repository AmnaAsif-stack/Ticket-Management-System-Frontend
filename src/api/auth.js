import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Backend URL from environment variables
});

export const signup = (formData) => API.post('/auth/signup', formData);
export const login = (formData) => API.post('/auth/login', formData);
