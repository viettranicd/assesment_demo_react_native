import BoxForm from '@/components/BoxForm';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewBoxScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <BoxForm mode="new" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
});