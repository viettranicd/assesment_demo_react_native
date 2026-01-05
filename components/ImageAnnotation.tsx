import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Button, Image, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Canvas, Path, Skia, Line, SkPath, Circle } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

// Lấy chiều rộng màn hình để tính toán kích thước ảnh
const { width: screenWidth } = Dimensions.get('window');
const IMAGE_CONTAINER_WIDTH = screenWidth - 32; // outer container width
const IMAGE_PADDING = 0; // inner padding to make edges easier

const GRID_COLS = 10;
const GRID_ROWS = 20;

// Component để vẽ lưới
const Grid = ({ width, height }: { width: number; height: number }) => {
  const stepX = width / GRID_COLS;
  const stepY = height / GRID_ROWS;

  return (
    <>
      {/* Vẽ các đường dọc */}
      {Array.from({ length: GRID_COLS + 1 }).map((_, i) => (
        <Line
          key={`col-${i}`}
          p1={{ x: i * stepX, y: 0 }}
          p2={{ x: i * stepX, y: height }}
          color="rgba(255, 255, 255, 0.25)"
          strokeWidth={1}
        />
      ))}
      {/* Vẽ các đường ngang */}
      {Array.from({ length: GRID_ROWS + 1 }).map((_, i) => (
        <Line
          key={`row-${i}`}
          p1={{ x: 0, y: i * stepY }}
          p2={{ x: width, y: i * stepY }}
          color="rgba(255, 255, 255, 0.25)"
          strokeWidth={1}
        />
      ))}
    </>
  );
};

export default function ImageAnnotation() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  // Tính toán kích thước ảnh sẽ hiển thị trên màn hình
  const imageDisplaySize = useMemo(() => {
    if (!image) return { width: 0, height: 0 };
    const drawableWidth = IMAGE_CONTAINER_WIDTH - IMAGE_PADDING * 2;
    const scale = image.width / drawableWidth;
    return {
      width: drawableWidth,
      height: image.height / scale,
    };
  }, [image]);

  // Hàm chọn ảnh
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      setPoints([]); // Reset các điểm vẽ khi chọn ảnh mới
    }
  };

  // Helper called on JS thread to add point
  const addPoint = (x: number, y: number) => {
    if (!image) return;

    const { width, height } = imageDisplaySize;
    if (width === 0 || height === 0) return;

    const stepX = width / GRID_COLS;
    const stepY = height / GRID_ROWS;

    const snappedX = Math.round(x / stepX) * stepX;
    const snappedY = Math.round(y / stepY) * stepY;

    // Clamp coordinates to stay within image bounds minus 2px (avoid being clipped by borderRadius)
    const margin = 2;
    const clampedX = Math.min(Math.max(snappedX, margin), width - margin);
    const clampedY = Math.min(Math.max(snappedY, margin), height - margin);

    setPoints(prev => [...prev, { x: clampedX, y: clampedY }]);
  };

  // Xử lý sự kiện chạm để vẽ (worklet)
  const tapGesture = useMemo(() =>
    Gesture.Tap().onEnd((event) => {
      // Pass coordinates to JS thread
      runOnJS(addPoint)(event.x, event.y);
    }),
  [imageDisplaySize, image]);

  // Tạo đường polyline từ các điểm đã chọn
  const polylinePath = useMemo<SkPath>(() => {
    const path = Skia.Path.Make();
    if (points.length > 0) {
      path.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        path.lineTo(points[i].x, points[i].y);
      }
    }
    return path;
  }, [points]);
  
  const undoLastPoint = () => {
    setPoints(prev => prev.slice(0, -1));
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, image ? styles.transparentBg : styles.whiteBg]}>
        {!image && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Image Annotation</Text>
          </View>
        )}

        <View style={styles.content}>
          {!image ? (
            <Button title="Chọn một bức ảnh" onPress={pickImage} />
          ) : (
            <View>
              <View style={[styles.imageContainer, { padding: IMAGE_PADDING, height: imageDisplaySize.height + IMAGE_PADDING * 2 }]}>
                {/* GestureDetector bọc ngoài Canvas để bắt sự kiện chạm */}
                <GestureDetector gesture={tapGesture}>
                  <View style={{ flex: 1 }}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.image}
                    />
                    <Canvas style={StyleSheet.absoluteFill}>
                      {/* Lớp 1: Vẽ lưới */}
                      <Grid width={imageDisplaySize.width} height={imageDisplaySize.height} />

                      {/* Lớp 2: Vẽ đường polyline */}
                      <Path
                        path={polylinePath}
                        style="stroke"
                        color="#00E676"
                        strokeWidth={4}
                      />

                      {/* Lớp 3: Vẽ các điểm đã chọn */}
                      {points.map((p, idx) => (
                        <Circle key={idx} cx={p.x} cy={p.y} r={6} color="#FF5252" />
                      ))}
                    </Canvas>
                  </View>
                </GestureDetector>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Ionicons name="refresh" size={24} color="white" />
                    <Text style={styles.buttonText}>Đổi hình</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={undoLastPoint}
                  disabled={points.length === 0}
                >
                    <Ionicons name="arrow-undo" size={24} color="white" />
                    <Text style={styles.buttonText}>Hoàn tác</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 15
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    width: IMAGE_CONTAINER_WIDTH,
    borderWidth: 0,
    borderRadius: 12,
    overflow: 'hidden', // Quan trọng để canvas không tràn ra ngoài
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Android shadow
  },
  image: {
    width: '100%',
    height: '100%',
  },
  controls: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  transparentBg: {
    backgroundColor: 'transparent',
  },
  whiteBg: {
    backgroundColor: 'white',
  },
});