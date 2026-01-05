import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, ActivityIndicator, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/components/ScreenHeader';
import { AiBox } from '@/constants/Type';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boxApis } from '@/apis/box.api';
import { cameraApis } from '@/apis/camera.api';
import DataEmpty from '@/components/DataEmpty';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import BoxInformationTab from './tabs/BoxInformationTab';
import BoxCamerasTab from './tabs/BoxCamerasTab';
import BoxVideosTab from './tabs/BoxVideosTab';
import BoxNotificationsTab from './tabs/BoxNotificationsTab';
import HorizontalTabBar from './tabs/HorizontalTabBar';

const TABS = [
  { key: 'Information', label: 'Information' },
  { key: 'Cameras', label: 'Cameras' },
  { key: 'Videos', label: 'Videos' },
  { key: 'Notifications', label: 'Notifications' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- COMPONENT CHÍNH ---
export default function BoxDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Information');
  const [activatedTabs, setActivatedTabs] = useState<Set<number>>(new Set([0]));
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const scrollX = useRef(new Animated.Value(0)).current;
  const tabScrollRef = useRef<ScrollView>(null);

  // Fetch box details
  const { data: boxData, isLoading, error } = useQuery<AiBox>({
    queryKey: ['box', id],
    queryFn: () => boxApis.getBoxDetail(id).then(res => res.data),
    enabled: !!id,
  });

  // Delete camera mutation
  const deleteCameraMutation = useMutation({
    mutationFn: (cameraId: number) => cameraApis.deleteCamera(cameraId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['box', id] });
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      setDeleteModalVisible(false);
      setCameraToDelete(null);
    },
  });

  const handleDeleteCamera = (cameraId: number) => {
    setCameraToDelete(cameraId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (cameraToDelete) {
      deleteCameraMutation.mutate(cameraToDelete);
    }
  };

  // Hook để kiểm soát Status Bar
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(styles.container.backgroundColor);
        StatusBar.setTranslucent(false);
      }
    }, [])
  );

  // Tab change with animation
  const handleTabChange = (tabKey: string, tabIndex: number) => {
    setActiveTab(tabKey);
    Animated.spring(scrollX, {
      toValue: tabIndex * SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();
    // Optionally scroll tab bar to keep active tab in view
    tabScrollRef.current?.scrollTo({ x: tabIndex * 100 - 50, animated: true });
  };

  const activeTabIndex = TABS.findIndex(t => t.key === activeTab);

  // Mark tab as activated for lazy rendering
  useEffect(() => {
    setActivatedTabs(prev => {
      if (prev.has(activeTabIndex)) return prev;
      const next = new Set(prev);
      next.add(activeTabIndex);
      return next;
    });
  }, [activeTabIndex]);

  // Animate sliding effect on tab change
  useEffect(() => {
    Animated.spring(scrollX, {
      toValue: activeTabIndex * SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();
  }, [activeTabIndex]);

  // Tab content array for shifting effect
  const tabContents = boxData ? [
    <BoxInformationTab key="info" boxData={boxData} isActive={activeTabIndex === 0} />,
    <BoxCamerasTab key="cameras" boxData={boxData} onDeleteCamera={handleDeleteCamera} isActive={activeTabIndex === 1} />,
    <BoxVideosTab key="videos" boxData={boxData} onDeleteCamera={handleDeleteCamera} isActive={activeTabIndex === 2} />,
    <BoxNotificationsTab key="notifications" boxData={boxData} onDeleteCamera={handleDeleteCamera} isActive={activeTabIndex === 3} />,
  ] : [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader label="Loading..." />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !boxData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader label="Error" />
        <View style={styles.loadingContainer}>
          <DataEmpty
            title="Failed to load box details"
            subtitle="Please try again later"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <ScreenHeader
        label={boxData.name}
        rightContent={
          <AnimatedPressable onPress={() => router.push(`/box/edit/${boxData.id}`)}>
            <Feather name="edit-3" size={24} color="black" />
          </AnimatedPressable>
        }
      />

      {/* TAB BAR */}
      <HorizontalTabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabScrollRef={tabScrollRef as React.RefObject<import('react-native').ScrollView>}
      />

      {/* TAB CONTENT WITH SLIDING EFFECT AND LAZY RENDER */}
      {boxData && (
        <Animated.View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: SCREEN_WIDTH * TABS.length,
            transform: [{ translateX: Animated.multiply(scrollX, -1) }],
          }}
        >
          {tabContents.map((content, idx) => (
            <View key={TABS[idx].key} style={{ width: SCREEN_WIDTH, flex: 1 }}>
              {activatedTabs.has(idx) ? content : null}
            </View>
          ))}
        </Animated.View>
      )}

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCameraToDelete(null);
        }}
      />
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarWrapper: {
    backgroundColor: '#F4F4F4',
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarScroll: {
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  infoContent: {
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    marginTop: 16,
    color: '#222',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#222',
  },
}); 