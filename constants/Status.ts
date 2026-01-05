import { StyleSheet } from 'react-native';

export enum BoxStatus {
  ONLINE = '40ONLINE',
  OFFLINE = '20OFFLINE',
  ERROR = '30ERROR',
  RUNNING = '50RUNNING'
}

export const getStatusStyle = (status: BoxStatus) => {
  switch (status) {
    case BoxStatus.ONLINE:
    case BoxStatus.RUNNING:
      return styles.statusOnline;
    case BoxStatus.OFFLINE:
      return styles.statusOffline;
    case BoxStatus.ERROR:
      return styles.statusError;
    default:
      return styles.statusOffline;
  }
};

export const getStatusTextStyle = (status: BoxStatus) => {
  switch (status) {
    case BoxStatus.ONLINE:
    case BoxStatus.RUNNING:
      return statusTextStyles.statusOnline;
    case BoxStatus.OFFLINE:
      return statusTextStyles.statusOffline;
    case BoxStatus.ERROR:
      return statusTextStyles.statusError;
    default:
      return statusTextStyles.statusOffline;
  }
};

export const getCardStyle = (status: BoxStatus) => {
  switch (status) {
    case BoxStatus.ONLINE:
    case BoxStatus.RUNNING:
      return styles.boxStatusOnline;
    case BoxStatus.OFFLINE:
      return styles.boxStatusOffline;
    case BoxStatus.ERROR:
      return styles.boxStatusError;
    default:
      return styles.boxStatusOffline;
  }
};

export const mappingStatus: Record<string, string> = {
  [BoxStatus.ONLINE]: 'Online',
  [BoxStatus.OFFLINE]: 'Offline',
  [BoxStatus.ERROR]: 'Error',
  [BoxStatus.RUNNING]: 'Running'
}

const statusTextStyles = StyleSheet.create({
  statusOnline: {
    color: '#7dfaa2',
  },
  statusOffline: {
    color: '#a7a9ab',
  },
  statusError: {
    color: '#fa6669',
  },
  boxStatusOnline: {
    color: '#abf7c2',
  },
  boxStatusOffline: {
    color: '#c4c6c7',
  },
  boxStatusError: {
    color: '#f79d9f',
  },
});

const styles = StyleSheet.create({
  statusOnline: {
    backgroundColor: '#7dfaa2',
  },
  statusOffline: {
    backgroundColor: '#a7a9ab',
  },
  statusError: {
    backgroundColor: '#fa6669',
  },
  boxStatusOnline: {
    backgroundColor: '#abf7c2',
  },
  boxStatusOffline: {
    backgroundColor: '#c4c6c7',
  },
  boxStatusError: {
    backgroundColor: '#f79d9f',
  },
});
