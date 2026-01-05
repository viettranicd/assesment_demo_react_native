import React, { useState, useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import WebView from "react-native-webview";

const loadingThreshold = Platform.OS === 'ios' ? 0.88 : 0.78;
const LOADING_TIMEOUT = 30000;

const JAVASCRIPT_TO_DISABLE_ZOOM = `
  (function() {
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, user-scalable=no');
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);
  })();
`;

interface CameraWebViewProps {
  uri: string;
  style?: any;
  onLoadProgress?: (event: { nativeEvent: { progress: number } }) => void;
  onError?: () => void;
  isFullscreen?: boolean;
}

export function CameraWebView({ 
  uri, 
  style, 
  onLoadProgress, 
  onError, 
  isFullscreen = false 
}: CameraWebViewProps) {
  const [progress, setProgress] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  // Timeout for loading
  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setProgress(0);
          setIsError(false);
          setIsLoading(true);
        } else {
          setIsError(true);
          setIsLoading(false);
        }
      }, LOADING_TIMEOUT) as unknown as number;
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoading, retryCount]);

  // Reset state if uri changes
  useEffect(() => {
    setProgress(0);
    setIsError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [uri]);

  const handleLoadProgress = useCallback(({ nativeEvent }: { nativeEvent: { progress: number } }) => {
    if (isError) return;
    setProgress(nativeEvent.progress);
    if (nativeEvent.progress >= loadingThreshold) {
      setIsLoading(false);
      setRetryCount(0);
    }
    onLoadProgress?.({ nativeEvent });
  }, [isError, onLoadProgress]);

  const handleError = useCallback(() => {
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setProgress(0);
      setIsError(false);
      setIsLoading(true);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
    onError?.();
  }, [retryCount, onError]);

  if (isError) {
    return (
      <View style={[styles.errorContainer, isFullscreen && styles.fullscreenErrorContainer, style]}>
        <Text style={[styles.errorText, isFullscreen && styles.fullscreenErrorText]}>
          Failed to load camera feed
        </Text>
        <Text style={[styles.loadingText, isFullscreen && styles.fullscreenLoadingText]}>
          Please check your connection or stream format.
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri }}
      style={style}
      startInLoadingState
      onLoadProgress={handleLoadProgress}
      renderLoading={() => {
        return progress < loadingThreshold ? (
          <View style={[styles.loadingContainer, isFullscreen && styles.fullscreenLoadingContainer]}>
            <ActivityIndicator size="large" color={isFullscreen ? "#007AFF" : "#007AFF"} />
            <Text style={[styles.loadingText, isFullscreen && styles.fullscreenLoadingText]}>
              Loading camera feed...
            </Text>
          </View>
        ) : <></>
      }}
      onError={handleError}
      bounces={false}
      scrollEnabled={false}
      setBuiltInZoomControls={false}
      injectedJavaScript={JAVASCRIPT_TO_DISABLE_ZOOM}
      onMessage={() => { }}
      androidLayerType="hardware"
      javaScriptEnabled
      domStorageEnabled
      allowsFullscreenVideo
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  fullscreenLoadingContainer: {
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  fullscreenLoadingText: {
    color: '#fff',
  },
  errorContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    borderRadius: 12,
    padding: 20,
  },
  fullscreenErrorContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  fullscreenErrorText: {
    textAlign: 'center',
  },
}); 