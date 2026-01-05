import { DeviceEventEmitter } from 'react-native';

export const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED';
export const NOTIFICATION_OPENED = 'NOTIFICATION_OPENED';

export const emitNotificationReceived = (notification: any) => {
  console.log('emitNotificationReceived', notification);
  DeviceEventEmitter.emit(NOTIFICATION_RECEIVED, notification);
};

export const emitNotificationOpened = (notification: any) => {
  DeviceEventEmitter.emit(NOTIFICATION_OPENED, notification);
}; 