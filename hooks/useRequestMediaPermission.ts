import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Permission } from 'react-native';

/**
 * Hook to request READ media permissions (images & videos) on Android.
 * For Android 13+, it requests READ_MEDIA_IMAGES and READ_MEDIA_VIDEO.
 * For Android 12 and below, it requests READ_EXTERNAL_STORAGE.
 * On iOS, the Info.plist entries should handle it automatically, so we simply return.
 * 
 * @returns {Object} An object containing permission status and request function
 * @property {boolean} hasPermission - Whether all required permissions are granted
 * @property {() => Promise<void>} requestPermission - Function to manually request permissions
 */
export default function useRequestMediaPermission() {
  const [hasPermission, setHasPermission] = useState(false);

  const checkPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const permissionsToCheck: Permission[] = [];
      
      if (Platform.Version >= 33) {
        permissionsToCheck.push(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        );
      } else {
        permissionsToCheck.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }

      // Check each permission individually
      const results = await Promise.all(
        permissionsToCheck.map(permission => 
          PermissionsAndroid.check(permission)
        )
      );
      return results.every(result => result === true);
    } catch (error) {
      console.error('Failed to check permissions:', error);
      return false;
    }
  };

  const requestPermission = async (): Promise<void> => {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      const permissionsToRequest: Permission[] = [];

      if (Platform.Version >= 33) {
        permissionsToRequest.push(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        );
      } else {
        permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }

      // Add a small delay to avoid conflicts with notification permission dialog
      await new Promise(resolve => setTimeout(resolve, 500));

      const results = await PermissionsAndroid.requestMultiple(permissionsToRequest);
      const allGranted = Object.values(results).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      setHasPermission(allGranted);

      if (allGranted) {
        console.log('Media permissions granted');
      } else {
        console.log('Media permissions denied or partially granted', results);
      }
    } catch (error) {
      console.error('Failed to request media permissions:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initPermissions = async () => {
      try {
        const isGranted = await checkPermissions();
        if (!mounted) return;
        
        setHasPermission(isGranted);
        
        if (!isGranted) {
          // Request permissions immediately on first app start
          await requestPermission();
        }
      } catch (error) {
        console.error('Error initializing permissions:', error);
      }
    };

    // Run immediately
    initPermissions();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    hasPermission,
    requestPermission,
  };
} 