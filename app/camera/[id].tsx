import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CameraForm from '@/components/CameraForm';
import { cameraApis } from '@/apis/camera.api';

export default function EditCameraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch camera detail only when id is available
  const { data: cameraData, isLoading } = useQuery({
    queryKey: ['camera', id],
    enabled: !!id,
    queryFn: () => cameraApis.getCameraDetail(parseInt(id as string, 10)).then(r => r.data),
  });

  const handleSuccess = () => {
    // Refresh data & navigate back
    queryClient.invalidateQueries({ queryKey: ['cameras'] });
    queryClient.removeQueries({ queryKey: ['camera', id] });
    router.back();
  };

  if (isLoading || !cameraData) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <CameraForm
        mode="edit"
        initialData={cameraData}
        cameraId={id as string}
        onSuccess={handleSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
}); 