import axios from 'axios';
import { API_KEY } from '../constants';
import { convertApiResponse } from '../utils/convertApiResponse';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add API key to all requests
    if (config.params) {
      config.params.api_key = API_KEY;
    } else {
      config.params = { api_key: API_KEY };
    }

    // Add language parameter
    if (config.params) {
      config.params.language = 'en-US';
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Automatically convert all API responses from snake_case to camelCase
    if (response.data) {
      response.data = convertApiResponse(response.data);
    }
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Unauthorized: Check your API key');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
