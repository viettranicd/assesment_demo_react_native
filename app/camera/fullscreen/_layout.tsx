import { Stack } from 'expo-router';

export default function CameraFullScreenLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
    }} />
  );
}