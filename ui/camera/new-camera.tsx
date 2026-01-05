import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import CameraForm from '@/components/CameraForm';

export default function NewCameraScreen() {
  const { boxId } = useLocalSearchParams<{ boxId: string }>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <CameraForm mode="new" boxId={boxId} initialData={{ boxId: parseInt(boxId || '0', 10) }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
});