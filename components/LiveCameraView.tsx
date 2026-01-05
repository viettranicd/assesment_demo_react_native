import React from "react";
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CameraWebView } from './CameraWebView';

interface Props {
  label: string;
  uri?: string;
}

export function LiveCameraView({ label, uri = "http://118.71.204.107:5012/camera1" }: Props) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/camera/fullscreen',
      params: { label, uri }
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.cameraFeed}>
        <Text style={styles.cameraName}>{label}</Text>
        <TouchableOpacity style={styles.expandButton} onPress={handlePress}>
          <Ionicons name="expand-outline" size={20} color="white" />
        </TouchableOpacity>
        <CameraWebView
          uri={uri}
          style={styles.cameraImage}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cameraFeed: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    position: "absolute",
    top: 0,
    zIndex: 1,
    color: 'white',
    backgroundColor: "black",
    padding: 5,
    opacity: 0.6,
    borderTopLeftRadius: 12
  },
  expandButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    padding: 5,
  },
  cameraImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    backgroundColor: '#DCDCDC' 
  },
});
