import React, { useCallback } from 'react';
import { ScrollView, Text, View, Image, StyleSheet, Dimensions, Platform, StatusBar as RNStatusBar } from 'react-native';
import Video from 'react-native-video';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedView from '@/components/AnimatedView';
import ScreenHeader from '@/components/ScreenHeader';
import type { AlarmType } from '@/constants/Type';

export default function AlarmDetailScreen({ alarm }: { alarm: AlarmType }) {
    const { Datetime, Data } = alarm;

    useFocusEffect(() => {
        RNStatusBar.setBarStyle('dark-content');
        if (Platform.OS === 'android') {
            RNStatusBar.setBackgroundColor('#FFFFFF');
            RNStatusBar.setTranslucent(false);
        }
    });

    const screenW = Dimensions.get('window').width;
    const mediaWidth = screenW - 32;
    const mediaHeight = mediaWidth * 0.6;

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader label="Chi tiết thông báo" />
            <AnimatedView delay={100} style={styles.headerSection}>
                <Text style={styles.title}>[{Data.AlarmID}] {Data.AlarmInfo}</Text>
                <Text style={styles.subtitle}>Thời gian: {Datetime}</Text>
                <Text style={styles.subtitle}>Box {Data.DeviceID} • Camera {Data.CameraID} • Zone {Data.Zone}</Text>
            </AnimatedView>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {Data.Images.map((uri, idx) => (
                    <AnimatedView key={idx} delay={150 + idx * 50} style={styles.mediaWrapper}>
                        <Image
                            source={{ uri }}
                            style={[styles.media, { width: mediaWidth, height: mediaHeight }]}
                            resizeMode="cover"
                        />
                    </AnimatedView>
                ))}
                {Data.Video.map((uri, idx) => (
                    <AnimatedView key={idx} delay={150 + Data.Images.length * 50 + idx * 50} style={styles.mediaWrapper}>
                        <Video
                            source={{ uri }}
                            style={[styles.media, { width: mediaWidth, height: mediaHeight }]}
                            controls
                            resizeMode="contain"
                        />
                    </AnimatedView>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerSection: {
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ECECEC',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 4,
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
    },
    mediaWrapper: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    media: {
        backgroundColor: '#000',
    },
});