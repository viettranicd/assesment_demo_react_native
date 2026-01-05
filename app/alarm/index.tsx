import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import type { AlarmType } from '@/constants/Type';
import { mockAlarms } from '@/ui/home/home'

export default function NotificationsList() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.list}>
                {mockAlarms.map(alarm => (
                    <AnimatedPressable
                        key={alarm.uuid}
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: `/alarm/${alarm.uuid}`,
                                params: {
                                    alarm: JSON.stringify(alarm),
                                },
                            })
                        }
                    >
                    </AnimatedPressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2' },
    list: { padding: 16 },
    card: {
        backgroundColor: '#F44336',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
});