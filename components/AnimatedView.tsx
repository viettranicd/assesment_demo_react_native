import { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withDelay, 
  withTiming,
  withSpring,
  FadeIn,
  LinearTransition
} from 'react-native-reanimated';

interface AnimatedViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  initialY?: number;
  duration?: number;
}

export default function AnimatedView({
  children,
  delay = 0,
  style,
  initialY = 20,
  duration = 300,
}: AnimatedViewProps) {
  const translateY = useSharedValue(initialY);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withSpring(0, { 
        damping: 15,
        stiffness: 100,
      })
    );
  }, []);

  return (
    <Animated.View
      style={[
        style,
        animatedStyle,
      ]}
      entering={FadeIn.delay(delay)}
      layout={LinearTransition.springify()}
    >
      {children}
    </Animated.View>
  );
} 