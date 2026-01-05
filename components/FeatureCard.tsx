import { StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedView from './AnimatedView';
import AnimatedPressable from './AnimatedPressable';

interface FeatureCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
  delay?: number;
  variant?: 'tall' | 'short';
  isBottomAligned?: boolean;
  isTopAligned?: boolean;
}

export function FeatureCard({ 
  title, 
  icon, 
  color, 
  onPress, 
  delay = 0,
  variant = 'tall',
  isBottomAligned = false,
  isTopAligned = false
}: FeatureCardProps) {
  return (
    <AnimatedView 
      style={[
        styles.container,
        variant === 'tall' ? styles.tallCard : styles.shortCard,
        isBottomAligned ? styles.bottomAligned : {},
        isTopAligned ? styles.topAligned : {}
      ]} 
      delay={delay}
    >
      <AnimatedPressable
        style={[
          styles.card,
          { backgroundColor: color }
        ]}
        onPress={onPress}
      >
        <Ionicons name={icon} size={48} color="white" />
        <Text style={styles.title}>{title}</Text>
        <Ionicons 
          name="arrow-forward-outline" 
          size={32} 
          color="white" 
          style={styles.arrow} 
        />
      </AnimatedPressable>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'space-between',
  },
  tallCard: {
    height: '110%',
  },
  shortCard: {
    height: '85%',
  },
  bottomAligned: {
    marginTop: 'auto',
  },
  topAligned: {
    marginBottom: 'auto',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  arrow: {
    position: 'absolute',
    top: 10,
    right: 10,
    transform: [{ rotate: '315deg' }],
  },
}); 