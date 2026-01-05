import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { boxApis } from '@/apis/box.api';
import BoxForm from '@/components/BoxForm';

export default function EditBoxScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch existing box detail
  const { data: boxData, isLoading } = useQuery({
    queryKey: ['box', id],
    enabled: !!id,
    queryFn: () => boxApis.getBoxDetail(id as string).then(r => r.data),
  });

  if (isLoading || !boxData) {
    return null;
  }

  const onUpdateSuccess = () => {
    // Remove the cache for this specific box
    queryClient.removeQueries({ queryKey: ['box', id] });
    // Invalidate the boxes list query
    queryClient.invalidateQueries({ queryKey: ['boxes'] });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BoxForm mode="edit" initialData={boxData} boxId={id} onSuccess={onUpdateSuccess} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
}); 