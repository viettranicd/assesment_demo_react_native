import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { CameraWebView } from '@/components/CameraWebView';

export default function FullscreenCameraScreen() {
  const { label, uri } = useLocalSearchParams<{ label: string; uri: string }>();
  const router = useRouter();

  // Set landscape orientation when component mounts
  useEffect(() => {
    const setLandscape = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    setLandscape();

    // Reset to portrait when component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
      
      {label && (
        <View style={styles.cameraNameContainer}>
          <Text style={styles.cameraName}>{label}</Text>
        </View>
      )}

      <CameraWebView
        uri={uri || "http://118.71.204.107:5016/camera1"}
        style={styles.fullscreenWebview}
        isFullscreen={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  cameraNameContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cameraName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fullscreenWebview: {
    flex: 1,
  },
}); 