import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, Image, FlatList, ViewToken, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import AnimatedView from '../../components/AnimatedView';
import AnimatedPressable from '../../components/AnimatedPressable';
import { formatDate } from '@/utils/helper';
import { AiBox } from '@/constants/Type';
import { mappingStatus, getStatusStyle } from '@/constants/Status';
import SwipeableCameraItem from '../../components/SwipeableCameraItem';

interface Camera {
  id: number;
  name: string;
  preview: string;
}

interface StickyHeaderCameraListProps {
  boxData: AiBox;
  onDeleteCamera: (id: number) => void;
}

const PROFILE_SECTION_HEIGHT = 150;

// QuickActionsSection component
const QuickActionsSection = React.memo(({ onAddCamera, style }: { onAddCamera: () => void, style?: any }) => {
  return (
    <View style={[styles.quickActionsSection, style]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionButtonsContainer}>
          <View>
            <AnimatedPressable style={styles.actionButtonCircle}>
              <Ionicons name="scan-outline" size={20} color="white" />
            </AnimatedPressable>
          </View>
          <View>
            <AnimatedPressable
              style={styles.actionButtonCircle}
              onPress={onAddCamera}
            >
              <Ionicons name="add" size={20} color="white" />
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </View>
  );
});

export default function StickyHeaderCameraList({
  boxData,
  onDeleteCamera
}: StickyHeaderCameraListProps) {
  const router = useRouter();
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [showStickyQuickActions, setShowStickyQuickActions] = useState(false);
  const listRef = useRef<Animated.FlatList<Camera>>(null);
  const { width } = useWindowDimensions();

  // Track scroll position for sticky restore
  const [cameraScrollY, setCameraScrollY] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const visibleIds = new Set(viewableItems.map(item => (item.item as Camera).id).filter(Boolean));
    setVisibleItems(visibleIds);
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
    minimumViewTime: 100,
  };

  // Memoize the onAddCamera handler
  const handleAddCamera = useCallback(() => {
    router.push({ pathname: '/camera/new', params: { boxId: boxData.id.toString() } });
  }, [router, boxData.id]);

  const keyExtractor = (item: Camera) => item.id.toString();

  // Render camera item
  const renderCameraItem = useCallback(({ item }: { item: Camera }) => (
    <View style={styles.cameraItemContainer}>
      {visibleItems.has(item.id) ? (
        <SwipeableCameraItem
          camera={item}
          onDelete={() => onDeleteCamera(item.id)}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.cameraName}>{item.name}</Text>
          <View style={styles.placeholderImage}>
            <Ionicons name="videocam-outline" size={40} color="#999" />
            <Text style={styles.placeholderText}>Camera Feed</Text>
          </View>
        </View>
      )}
    </View>
  ), [visibleItems, onDeleteCamera]);

  return (
    <View style={styles.container}>
      <QuickActionsSection
        onAddCamera={handleAddCamera}
      />
      <Animated.FlatList
        ref={listRef}
        data={boxData.cameras || []}
        renderItem={renderCameraItem}
        keyExtractor={keyExtractor}
        // onScroll={handleScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingTop: 0 }]}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  profileSection: {
    height: PROFILE_SECTION_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
  },
  profileContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileText: {
    fontSize: 16,
    color: '#3C3C43',
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  quickActionsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  actionButtonsContainer: {
    flexDirection: 'row'
  },
  actionButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 17,
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#007AFF'
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000'
  },
  activeTabText: {
    color: '#fff'
  },
  cameraItemContainer: {
    paddingHorizontal: 16,
  },
  placeholderContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
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
    opacity: 0.6,
    borderTopLeftRadius: 12
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  emptyContent: {
    flex: 1,
  },
  contentPadding: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  stickyQuickActions: {
    backgroundColor: '#F4F4F4',
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
}); 