import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LiveCameraView } from '@/components/LiveCameraView';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CamerasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20
          }}
        >
          <View style={styles.header}>
            <ThemedText type="title">Live Cameras</ThemedText>
            <ThemedText style={styles.subtitle}>Monitor your cameras in real-time</ThemedText>
          </View>

          <View style={styles.cameraGrid}>
            <View style={styles.cameraCard}>
              <ThemedText style={styles.cameraLabel}>Camera 1</ThemedText>
              <LiveCameraView label={'Camera 1'} />
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="volume-mute-outline" size={20} color="#1E88E5" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => router.push({
                    pathname: '/camera/fullscreen/index',
                    params: { label: 'Camera 1', uri: 'http://118.71.204.107:5016/camera1' }
                  })}
                >
                  <Ionicons name="expand-outline" size={20} color="#1E88E5" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cameraCard}>
              <ThemedText style={styles.cameraLabel}>Camera 2</ThemedText>
              <View style={styles.offlineCamera}>
                <Ionicons name="videocam-off-outline" size={40} color="#777" />
                <ThemedText style={styles.offlineText}>Offline</ThemedText>
              </View>
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="volume-mute-outline" size={20} color="#777" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => router.push({
                    pathname: '/camera/fullscreen/index',
                    params: { label: 'Camera 2', uri: 'http://118.71.204.107:5016/camera2' }
                  })}
                >
                  <Ionicons name="expand-outline" size={20} color="#777" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
  },
  cameraGrid: {
    flexDirection: 'column',
    gap: 20,
  },
  cameraCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  offlineCamera: {
    height: 250,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineText: {
    marginTop: 8,
    color: '#777',
  }
});