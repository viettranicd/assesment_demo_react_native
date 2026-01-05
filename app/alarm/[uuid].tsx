import { useLocalSearchParams } from 'expo-router';
import AlarmDetailScreen from '@/ui/alarm/alarm-detail';
import type { AlarmType } from '@/constants/Type';

export default function Detail() {
    const { alarm } = useLocalSearchParams<{ alarm: string }>();
    const alarmObj: AlarmType = JSON.parse(alarm);
    return <AlarmDetailScreen alarm={alarmObj} />;
}
