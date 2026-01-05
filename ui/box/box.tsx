import { Ionicons, Octicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import AnimatedView from '@/components/AnimatedView';
import { BoxStatus, getStatusStyle, getCardStyle, mappingStatus } from '../../constants/Status';
import { boxApis } from '@/apis/box.api';
import { useQuery } from '@tanstack/react-query';
import { AiBox } from '@/constants/Type';
import BoxLoading from '@/components/BoxLoading';
import DataEmpty from '@/components/DataEmpty';
import { formatDate } from '@/utils/helper';
import ScreenHeader from '@/components/ScreenHeader';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function BoxScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: boxes = [], isLoading, error } = useQuery<AiBox[]>({
    queryKey: ['boxes'],
    queryFn: () => boxApis.getBoxes().then(res => res.data),
  });

  // Sync state and rotation animation
  const [isSyncing, setIsSyncing] = React.useState(false);
  const rotation = useSharedValue(0);

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const startRotation = () => {
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  };

  const stopRotation = () => {
    rotation.value = withTiming(0, { duration: 200 });
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    startRotation();
    try {
      await boxApis.sync();
      // Refresh boxes list after sync
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
    } catch (err) {
      console.error('Sync boxes failed', err);
    } finally {
      stopRotation();
      setIsSyncing(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <BoxLoading />;
    }

    if (!boxes.length) {
      return (
        <DataEmpty
          title="No boxes found"
          subtitle="You haven't added any boxes yet. Add a new box to get started."
        />
      );
    }

    const renderItem = ({ item: box, index }: { item: AiBox; index: number }) => (
      <AnimatedView
        delay={150 + index * 100}
        initialY={20}
        style={[getCardStyle(box.status), styles.boxCard]}
      >
        <Link href={`/box/${box.id}`} asChild>
          <AnimatedPressable style={styles.boxCard}>
            {/* Box Info */}
            <View style={styles.boxInfo}>
              <Image
                source={require('../../assets/images/camera-box.png')}
                style={styles.boxImage}
              />
              <View style={styles.boxDetails}>
                <Text style={styles.boxName}>{box.name}</Text>
                <Text style={[styles.boxSubtext, { marginBottom: 2 }]}>Created at: {formatDate(box.createdAt)}</Text>
                <Text style={styles.boxSubtext}>Num of camera: {box.cameras?.length ?? 0}</Text>
              </View>
              <View style={[styles.arrowContainer, { borderColor: getStatusStyle(box.status).backgroundColor }]}>
                <Ionicons name="chevron-forward" size={20} color="#707376" />
              </View>
            </View>
            <View style={styles.updateInfo}>
              {/* Update Info */}
              <View>
                <Text style={styles.updateLabel}>Last update</Text>
                <Text style={styles.updateTime}>{formatDate(box.updatedAt)}</Text>
              </View>
              {/* Status Info */}
              <View style={styles.rightContent}>
                <View style={[styles.statusBadge, getStatusStyle(box.status)]}>
                  <Text style={styles.statusText}>{mappingStatus[box.status]}</Text>
                </View>
              </View>
            </View>
          </AnimatedPressable>
        </Link>
      </AnimatedView>
    );

    return (
      <FlatList
        data={boxes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ScreenHeader
        label='Boxs'
        rightContent={
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 10, paddingEnd: 10 }}>
            <Ionicons
              name="add-outline"
              size={28}
              color="black"
              onPress={() => router.push("/box/new")}
              key="new-box"
            />
            <TouchableOpacity key="sync-box" onPress={handleSync} disabled={isSyncing}>
              <Animated.View style={rotateStyle}>
                <Octicons name="sync" size={24} color="black" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        }
      />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scrollView: {
    // flex: 1,
    // padding: 16,
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  boxCard: {
    flexDirection: 'column',
    borderRadius: 15,
    paddingRight: 7,
    paddingLeft: 7,
    paddingTop: 7,
    marginBottom: 15,
  },
  boxInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxImage: {
    width: 64,
    height: 64,
    borderRadius: 50,
    marginRight: 12,
  },
  boxDetails: {
    flex: 1,
    // marginTop: 5
  },
  boxName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    marginTop: 5
  },
  boxSubtext: {
    fontSize: 14,
    color: '#5d6760',
  },
  updateInfo: {
    marginTop: 25,
    flexDirection: 'row',
    marginLeft: 5
  },
  updateLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 4,
    fontWeight: "condensedBold"
  },
  updateTime: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    // marginTop: -7
  },
  statusBadge: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    // marginRight: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  arrowContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  }
});