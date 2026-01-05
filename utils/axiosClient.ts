// src/utils/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import { getNavigationStore } from './navigationStore';

export const TOKEN_KEY = '@auth_token';
export const REFRESH_TOKEN_KEY = '@refresh_token';

interface JWTPayload {
  exp: number;
  // Add other JWT payload fields as needed
}
// Determine API base URL
// const baseURL = Config.API_URL
//   ? Config.API_URL
//   : Platform.OS === 'android'
//     ? 'http://10.0.2.2:8080' // Android emulator alias for localhost
//     : 'http://localhost:8080';
// console.log("=======baseURL=======", baseURL);
const baseURL = "http://10.0.2.2:8080"

const axiosInstance = axios.create({
  baseURL, // Replace with your API base URL
  timeout: 30000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'Authorization': 'Bearer YOUR_TOKEN', // Example for authorization header
  },
});

// Function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // If we can't decode the token, consider it expired
  }
};

// Function to handle logout
const handleLogout = async () => {
  console.log("=======handleLogout=======");
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
    const currentPath = getNavigationStore.getState().currentPath
    if (currentPath !== '/') {
      router.replace('/');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add request interceptor – just attach token (no refresh here)
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        if (isTokenExpired(token)) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh access token
const refreshAccessToken = async (): Promise<string | void> => {
  try {
    const expiredAccessToken = await AsyncStorage.getItem(TOKEN_KEY);
    if (expiredAccessToken) {
      if (isRefreshing) {
        // If a refresh is already in progress, wait for it
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }
  
      isRefreshing = true;
      // console.log("=======expiredAccessToken=======", expiredAccessToken);
      if (expiredAccessToken && isTokenExpired(expiredAccessToken)) {
        await handleLogout();
        return;
      }
      console.log("=======expiredAccessToken=======", expiredAccessToken);
      // Decode token to get username claim (adjust key if server uses a different claim)
      let username: string | undefined;
      try {
        const decoded: any = jwtDecode(expiredAccessToken);
        username = decoded.username || decoded.sub || decoded.userName;
      } catch (err) {
        console.log('Failed to decode token to extract username', err);
      }
      console.log("=======username=======", username);
      if (!username) {
        await handleLogout();
        return;
      }
  
      // Call refresh token API using *plain* axios to avoid interceptor recursion
      const response = await axios.post(`${baseURL}/auth/refresh-token`, {
        username,
      });
      console.log("=======response=======", response);
      const { accessToken, newRefreshToken } = response.data;
      console.log("=======accessToken=======", accessToken);
      console.log("=======newRefreshToken=======", newRefreshToken);
  
      // Store new tokens
      await AsyncStorage.setItem(TOKEN_KEY, accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
  
      // Process queue with new token
      processQueue(null, accessToken);
      return accessToken;
    }
  } catch (error) {
    processQueue(error, null);
    await handleLogout();
    return;
  } finally {
    isRefreshing = false;
  }
};

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string, refreshToken: string) => {
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

export default axiosInstance;