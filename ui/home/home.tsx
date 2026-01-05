import { ThemedView } from '@/components/ThemedView';
import AnimatedView from '@/components/AnimatedView';
import AnimatedPressable from '@/components/AnimatedPressable';
import { FeatureCard } from '@/components/FeatureCard';
import { useRouter } from 'expo-router';
import { StyleSheet, Image, ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
// import useRequestNotificationPermission from '@/hooks/useRequestNotificationPermission';
import type { AlarmType } from '@/constants/Type';

export const mockAlarms: AlarmType[] = [
  {
    Datetime: '2025-06-11 10:15:00',
    uuid: '48e9b3a2-7eb0-44f1-998e-066752aaca12',
    Data: {
      DeviceID: '1',
      CameraID: '1',
      Zone: '1',
      AlarmID: '1',
      AlarmInfo: 'Báo cháy khu vực 1',
      Images: [
        'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/10/tai-anh-phong-canh-dep-thump.jpg',
        'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/10/tai-anh-phong-canh-dep-1.jpg',
      ],
      Video: ['http://118.71.204.107:5018/video'],
    },
  },
  {
    Datetime: '2025-06-11 09:50:00',
    uuid: 'f1a2b3c4-5d6e-7f80-1234-abcdef567890',
    Data: {
      DeviceID: '1',
      CameraID: '2',
      Zone: '3',
      AlarmID: '2',
      AlarmInfo: 'Đột nhập khu vực 3',
      Images: ['https://example.com/images/breach1.jpg'],
      Video: [],
    },
  },
]

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // useRequestNotificationPermission()

  // Get today's date in format DD/MM/YYYY - HH:mm
  const today = new Date();
  const dateString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <AnimatedView style={styles.header} initialY={-20}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.profilePic}
          />
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="black" />
          </TouchableOpacity>
        </AnimatedView>

        {/* Today/date section */}
        <AnimatedView style={styles.todaySection} delay={250}>
          <Text style={styles.todayLabel}>Today</Text>
          <Text style={styles.todayDate}>{dateString}</Text>
        </AnimatedView>

        {/* Features section */}
        <View style={styles.featuresSection}>
          <AnimatedView style={styles.sectionHeader} delay={300}>
            <Text style={styles.sectionTitle}>Features</Text>
            <Text style={styles.sectionSubtitle}>Others</Text>
          </AnimatedView>

          <View style={styles.featuresContainer}>
            <View style={styles.featuresRow}>
              <FeatureCard
                title="Boxs"
                icon="camera-outline"
                color="#465CD4"
                onPress={() => router.push('/box')}
                delay={150}
                variant="tall"
              />
              <FeatureCard
                title="Add box"
                icon="add"
                color="#FF7135"
                delay={200}
                variant="short"
              />
            </View>

            <View style={[styles.featuresRow, styles.bottomRow]}>
              <FeatureCard
                title="Cameras"
                icon="camera-outline"
                color="#2FA173"
                delay={250}
                variant="short"
              />
              <FeatureCard
                title="Playback"
                icon="videocam-outline"
                color="#4089B4"
                delay={300}
                variant="tall"
              />
            </View>
          </View>
        </View>

        {/* Recent notifications header */}
        <AnimatedView style={styles.notificationsHeader} delay={350}>
          <Text style={styles.sectionTitle}>Recent notifications</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </AnimatedView>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        >
          <View style={styles.notificationsSection}>
            {mockAlarms.map((alarm, index) => (
              <AnimatedView key={alarm.uuid} delay={400 + index * 50}>
                <AnimatedPressable
                  style={styles.notificationCard}
                  onPress={() =>
                    router.push({
                      pathname: `/alarm/${alarm.uuid}`,
                      params: {
                        alarm: JSON.stringify(alarm),
                      },
                    })
                  }
                >
                  <View style={styles.notificationIconContainer}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={24}
                      color="white"
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {alarm.Data.AlarmInfo}
                    </Text>
                    <Text style={styles.notificationText}>
                      Thời gian: {alarm.Datetime}
                    </Text>
                    <Text style={styles.notificationText}>
                      {alarm.Data.Images.length > 0
                        ? `${alarm.Data.Images.length} ảnh`
                        : 'Không có ảnh'}
                    </Text>
                  </View>
                </AnimatedPressable>
              </AnimatedView>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F2F2F2',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  todaySection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 0,
  },
  todayLabel: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
  },
  todayDate: {
    fontSize: 18,
    color: '#A0A0A0',
    marginTop: 2,
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    height: "38%",
  },
  featuresContainer: {
    flex: 1,
    marginTop: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    height: '48%',
    columnGap: 5
  },
  bottomRow: {
    alignItems: 'flex-end',
  },
  bottomAlignContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  seeAllText: {
    color: '#1E88E5',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  notificationsSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  notificationCard: {
    backgroundColor: '#F44336',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIconContainer: {
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  notificationText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 0,
  },
});