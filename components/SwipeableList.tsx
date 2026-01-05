import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeableItem from 'react-native-swipeable-item';

interface SwipeableListProps {
  children: React.ReactNode;
}

export default function SwipeableList({ children }: SwipeableListProps) {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 