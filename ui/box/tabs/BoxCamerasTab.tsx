import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { AiBox } from '@/constants/Type';
import StickyHeaderCameraList from '@/ui/camera/StickyHeaderCameraList';

interface BoxCamerasTabProps {
  boxData: AiBox;
  onDeleteCamera: (id: number) => void;
  isActive: boolean;
}

export default function BoxCamerasTab({ boxData, onDeleteCamera, isActive = false }: BoxCamerasTabProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive && !shouldRender) {
      // Reduced delay for smoother transitions
      const timer = setTimeout(() => {
        setShouldRender(true);
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 50);

      return () => clearTimeout(timer);
    } else if (!isActive && shouldRender) {
      // Fade out when becoming inactive
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isActive, shouldRender, fadeAnim]);

  console.log("===========BoxCameraTab", { isActive, shouldRender });

  // Only render if active and shouldRender is true
  if (!isActive || !shouldRender) {
    return null;
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <StickyHeaderCameraList
        boxData={boxData}
        onDeleteCamera={onDeleteCamera}
      />
    </Animated.View>
  );
} 