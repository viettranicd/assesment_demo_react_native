import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedView from './AnimatedView';

interface DataEmptyProps {
  title: string;
  subtitle?: string;
}

export default function DataEmpty({ title, subtitle }: DataEmptyProps) {
  return (
    <AnimatedView style={styles.container} delay={150}>
      <View style={styles.iconContainer}>
        <Ionicons name="cube-outline" size={64} color="#A0A0A0" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 