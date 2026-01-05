import { useEffect } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import { AuthorizationStatus, requestPermission } from '@react-native-firebase/messaging';
import { initMessaging } from './useMessaging';

const useRequestNotificationPermission = () => {
  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        const messagingInstance = initMessaging()

        if (Platform.OS === 'android' && Platform.Version >= 33) {
          // For Android 13 and above, we need to request POST_NOTIFICATIONS permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            // {
            //   title: 'Notification Permission',
            //   message: 'This app needs notification permission to send you updates.',
            //   buttonNeutral: 'Ask Me Later',
            //   buttonNegative: 'Cancel',
            //   buttonPositive: 'OK',
            // }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        }

        // Request FCM permission
        const authStatus = await requestPermission(messagingInstance);

        if (authStatus === AuthorizationStatus.AUTHORIZED) { // AuthorizationStatus.AUTHORIZED
          console.log('User has notification permissions enabled.');
          // const fcmToken = await getToken(messagingInstance);
          // console.log('FCM Token:', fcmToken);
        } else if (authStatus === AuthorizationStatus.PROVISIONAL) { // AuthorizationStatus.PROVISIONAL
          console.log('User has provisional notification permissions.');
        } else {
          Alert.alert(
            'Permission Required',
            'Please enable notifications to receive important updates.',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  // You might want to add a way to open settings here
                  console.log('Open settings');
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        }
      } catch (error) {
        console.error('Failed to get notification permission:', error);
      }
    };

    requestUserPermission();
  }, []);
};

export default useRequestNotificationPermission; 