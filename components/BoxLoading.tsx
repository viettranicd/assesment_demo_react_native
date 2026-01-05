import { StyleSheet, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function BoxLoading() {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <Animated.View
          key={item}
          style={[
            styles.skeletonCard,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.topContent}>
            <View style={styles.circle} />
            <View style={styles.lines}>
              <View style={styles.line} />
              <View style={styles.shortLine} />
            </View>
            <View style={styles.arrow} />
          </View>
          <View style={styles.bottomContent}>
            <View style={styles.updateLine} />
            <View style={styles.statusBadge} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeletonCard: {
    backgroundColor: '#E1E9EE',
    borderRadius: 15,
    padding: 10,
    marginBottom: 16,
  },
  topContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D0D0D0',
    marginRight: 12,
  },
  lines: {
    flex: 1,
  },
  line: {
    height: 14,
    backgroundColor: '#D0D0D0',
    borderRadius: 7,
    marginBottom: 8,
    width: '80%',
  },
  shortLine: {
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 6,
    width: '60%',
  },
  arrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D0D0D0',
  },
  bottomContent: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateLine: {
    height: 12,
    backgroundColor: '#D0D0D0',
    borderRadius: 6,
    width: 100,
  },
  statusBadge: {
    height: 30,
    backgroundColor: '#D0D0D0',
    borderRadius: 15,
    width: 100,
  },
}); 