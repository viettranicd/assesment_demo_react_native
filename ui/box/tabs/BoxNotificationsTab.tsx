import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AiBox } from '@/constants/Type';

interface BoxNotificationsTabProps {
  boxData: AiBox;
  onDeleteCamera: (id: number) => void;
  isActive: boolean
}

export default function BoxNotificationsTab({ boxData, isActive = false }: BoxNotificationsTabProps) {
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
          <Ionicons name="notifications-outline" size={60} color="#999" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 8 }}>No notifications</Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>Notifications from this box will appear here</Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
} 