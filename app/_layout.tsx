import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';
import { onMessage, getInitialNotification } from '@react-native-firebase/messaging';
import { emitNotificationReceived, emitNotificationOpened } from '../utils/notificationEmitter';
import { NotificationBanner } from '../components/NotificationBanner';
import useRequestNotificationPermission from '@/hooks/useRequestNotificationPermission';
import useRequestMediaPermission from '@/hooks/useRequestMediaPermission';
import { initMessaging } from '@/hooks/useMessaging';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { getNavigationStore } from '@/utils/navigationStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { TOKEN_KEY } from '@/utils/axiosClient';

const messaging = initMessaging()
//open noti from background
messaging.setBackgroundMessageHandler(async remoteMessage => {
  console.log("=======background=======", remoteMessage)
  const { title, body } = remoteMessage.data ?? {};

  if (!title && !body) {
    console.log('[BG] Message without title/body:', remoteMessage);
    return;
  }

  // await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: title as string,
  //     body: body as string,
  //     data: remoteMessage.data,
  //   },
  //   trigger: null,
  // });

  console.log('[BG] Custom local notification displayed');
  return Promise.resolve()
});

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const currentPathName = usePathname()
  const setCurrentPath = getNavigationStore(state => state.setCurrentPath)
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Request notification permission when app starts
  useRequestNotificationPermission();
  // Request photo & video read permission when app starts (Android)
  useRequestMediaPermission();

  useEffect(() => {
    // App running notification (app running)
    const unsubscribe = onMessage(messaging, async remoteMessage => {
      console.log("=======apprunning=======", remoteMessage)
      // Emit event; NotificationBanner will schedule a local notification once to display banner.
      if (!remoteMessage.data || Object.keys(remoteMessage.data).length === 0) {
        console.log('[App] Omit empty message', remoteMessage);
        return;
      }
      emitNotificationReceived(remoteMessage);
      return Promise.resolve();
    });

    // Notification click khi app bị kill
    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        emitNotificationOpened(remoteMessage);
        console.log('App khởi động từ thông báo:', remoteMessage.notification);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('high_importance_channel', {
        name: 'High Importance',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

  useEffect(() => {
    setCurrentPath(currentPathName)
  }, [])

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          // Check expiry
          let isExpired = false;
          try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            isExpired = decoded.exp < currentTime;
          } catch (err) {
            // If decode fails, treat as expired
            isExpired = true;
          }

          if (!isExpired) {
            // If token valid and not already on tabs, navigate to home/tabs
            if (!currentPathName.startsWith('/home')) {
              router.replace('/home');
            }
          }
        }
      } catch (err) {
        console.log('Failed to read token', err);
      }
    };

    checkTokenAndNavigate();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NotificationBanner />
          <Stack
            initialRouteName="(auth)"
            screenOptions={{
              headerShown: false,
              animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
              presentation: 'card',
              animationDuration: 200,
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              ...Platform.select({
                ios: {
                  fullScreenGestureEnabled: true,
                },
              }),
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="camera"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
                presentation: 'card',
                gestureEnabled: true,
                gestureDirection: 'horizontal',
              }}
            />
            <Stack.Screen
              name="box"
              options={{
                headerShown: false,
                animation: 'slide_from_right',
                presentation: 'card',
                gestureEnabled: true,
                gestureDirection: 'horizontal',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

