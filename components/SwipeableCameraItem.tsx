import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Modal, TouchableOpacity } from 'react-native';
import SwipeableItem, { SwipeableItemImperativeRef } from 'react-native-swipeable-item';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AnimatedPressable from './AnimatedPressable';
import { LiveCameraView } from './LiveCameraView';

interface SwipeableCameraItemProps {
  camera: {
    id: number;
    name: string;
    preview: string;
  };
  onDelete: (id: number) => void;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.2;

function SwipeableCameraItemComponent({ camera, onDelete }: SwipeableCameraItemProps) {
  const router = useRouter();
  const itemRef = React.useRef<SwipeableItemImperativeRef>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    itemRef.current?.close();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(camera.id);
  };

  const renderUnderlayRight = () => {
    return (
      <View style={styles.rightActions}>
        <AnimatedPressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            itemRef.current?.close();
            router.push(`/camera/${camera.id}`);
          }}
        >
          <Ionicons name="pencil" size={24} color="blue" />
        </AnimatedPressable>
        <AnimatedPressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={24} color="red" />
        </AnimatedPressable>
      </View>
    );
  };

  return (
    <View style={styles.swipeableContainer}>
      <SwipeableItem
        ref={itemRef}
        key={camera.id}
        item={camera}
        renderUnderlayRight={renderUnderlayRight}
        snapPointsRight={[100]}
        overSwipe={20}
        activationThreshold={SWIPE_THRESHOLD}
      >
        <LiveCameraView label={camera.name} />
      </SwipeableItem>

      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Camera</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this camera? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  swipeableContainer: {
    marginBottom: 20,
  },
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
    opacity: 0.4,
    borderTopLeftRadius: 12
  },
  cameraImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    backgroundColor: '#DCDCDC' 
  },
  rightActions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    height: '100%',
  },
  actionButton: {
    width: 80,
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    borderRadius: 15,
    margin: 10
  },
  editButton: {
    backgroundColor: '#6fb5ff',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    // marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#ff9993',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    // marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  confirmButtonText: {
    color: 'white',
  },
});

export default React.memo(SwipeableCameraItemComponent); 