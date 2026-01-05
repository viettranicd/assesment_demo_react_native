import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AiBox } from '@/constants/Type';

interface BoxVideosTabProps {
  boxData: AiBox;
  onDeleteCamera: (id: number) => void;
  isActive: boolean
}

export default function BoxVideosTab({ boxData, isActive = false }: BoxVideosTabProps) {
  if (!isActive) {
    return null
  }
  return (
    <Animated.FlatList
      data={[]}
      renderItem={null}
      keyExtractor={() => ''}
      ListEmptyComponent={
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Ionicons name="videocam-outline" size={60} color="#999" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 }}>No videos found</Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>Recorded videos will appear here</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
} 