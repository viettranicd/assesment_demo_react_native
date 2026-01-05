import { useEffect } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NOTIFICATION_RECEIVED } from '../utils/notificationEmitter';

const { AndroidImportance } = Notifications; // for channel importance use later

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // Show system banner/list while app in foreground (iOS) and heads-up on Android
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const NotificationBanner = () => {
  useEffect(() => {
    // Set up Android notification channel
    const setupNotificationChannel = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    // Request permissions (required for iOS and Android 13+ (API 33+))
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions not granted');
        }
      }
    };

    setupNotificationChannel();
    requestPermissions();

    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification.request.content.data);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response.notification.request.content.data);
      // Handle notification interaction here
    });

    const subscription = DeviceEventEmitter.addListener(
      NOTIFICATION_RECEIVED,
      async (notificationData) => {
        console.log('======Notification received:', notificationData);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notificationData.data?.title || 'Thông báo',
            body: notificationData.data?.body,
            data: notificationData,
          },
          trigger: null,
        });
      }
    );
    console.log('Message handled in the background! NotificationBanner');
    return () => {
      subscription.remove();
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return null;
}; 