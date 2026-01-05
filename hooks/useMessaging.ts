import { FirebaseMessagingTypes, getMessaging, getToken } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import { Platform } from 'react-native';

var app = getApp();
var messagingInstance: FirebaseMessagingTypes.Module

export const initMessaging = () => {
  if (!messagingInstance) {
    messagingInstance = getMessaging(app);
  }
  return messagingInstance;
}

export const fetchFCMToken = async () => {
  const messagingInstance = initMessaging();

  // On iOS, a device must be registered for remote messages before
  // interacting with FCM (e.g., retrieving an FCM token). If this step
  // is skipped, calls such as `getToken` will fail silently or throw,
  // which is the behaviour observed on iOS devices.
  if (Platform.OS === 'ios') {
    try {
      // Ensures the device is able to receive remote notifications.
      await messagingInstance.registerDeviceForRemoteMessages();
    } catch (err) {
      console.warn('[useToken] Failed to register device for remote messages:', err);
    }
  }

  try {
    const token = await getToken(messagingInstance);
    return token;
  } catch (err) {
    console.warn('[useToken] Failed to retrieve FCM token:', err);
    return undefined;
  }
}