import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axiosClient from '@/utils/axiosClient';
import { fetchFCMToken } from '@/hooks/useMessaging';

export const GoogleLogin = async () => {
  // check if users' device has google play services
  await GoogleSignin.hasPlayServices();

  // initiates signIn process
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

export const getFCMToken = async () => {
  const token = await fetchFCMToken();
  return token;
}

export const authApis = {
  login: (username: string, password: string) => axiosClient.post('/auth/login', { username, password }),
  loginFirebase: (payload: { username: string, fcmToken?: string, oldFcmToken?: string, avtUrl?: string | null }) => axiosClient.post('/auth/firebase-login', payload),
  refreshToken: (username: string) => axiosClient.get('/auth/refresh-token', { params: { username } })
}