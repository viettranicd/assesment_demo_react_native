// import GoogleSignInButton from '@/components/GoogleSignInButton';
import TextInput from '@/components/inputs/TextInput';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { authApis, getFCMToken, GoogleLogin } from '@/apis/auth.api';
import { setAuthToken } from '@/utils/axiosClient';
import AnimatedPressable from '@/components/AnimatedPressable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

GoogleSignin.configure({
  // webClientId: process.env.EXPO_PUBLIC_WEB_ID,
  webClientId: Config.WEB_CLIENT_ID,
  scopes: ['profile', 'email'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: false,
  // iosClientId: process.env.EXPO_PUBLIC_IOS_ID,
});

WebBrowser.maybeCompleteAuthSession();

const FCM_TOKEN_KEY = '@fcm_token';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const firebaseUserRef = useRef<{ username: string, avtUrl?: string | null }>({ username: '', avtUrl: '' })

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const validateFields = () => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (type: "normal" | "google") => {
    if (type === "normal" && !validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      // Button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }),
      ]).start();

      let loginSuccess = false;

      switch (type) {
        case "normal":
          const res = await authApis.login(email, password);
          loginSuccess = res?.data;
          firebaseUserRef.current = { username: email, avtUrl: null }
          break;

        case "google":
          try {
            const response = await GoogleLogin();
            const { idToken, user } = response.data ?? {};
            console.log("======user", user)
            if (idToken && user) {
              firebaseUserRef.current = { username: user.email, avtUrl: user.photo };
              loginSuccess = true;
            }
          } catch (error) {
            console.log('Google Sign In Error:', error);
          }
          break;
      }

      if (loginSuccess) {
        const newFcmToken = await getFCMToken();
        console.log('FCM Token:', newFcmToken);

        // Prepare payload
        const payload: { username: string; avtUrl?: string | null; fcmToken?: string; oldFcmToken?: string } = {
          username: type === "normal" ? email : firebaseUserRef.current.username,
          avtUrl: firebaseUserRef.current.avtUrl,
        };

        if (newFcmToken) {
          // Retrieve stored token
          const storedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

          if (!storedToken) {
            // No previous token -> save and include in request
            await AsyncStorage.setItem(FCM_TOKEN_KEY, newFcmToken);
            payload.fcmToken = newFcmToken;
          } else if (storedToken !== newFcmToken) {
            // Token changed -> send both and update storage
            payload.fcmToken = newFcmToken;
            payload.oldFcmToken = storedToken;
            await AsyncStorage.setItem(FCM_TOKEN_KEY, newFcmToken);
          } else {
            // Same token -> nothing to include
            payload.fcmToken = storedToken;
          }
        } else {
          Alert.alert('Error', 'Happend error during get FCM token');
          return
        }

        try {
          const res = await authApis.loginFirebase(payload);
          const data = res?.data;
          console.log("Firebase Login Response:", data);

          if (data?.token && data?.refreshToken) {
            // Update both tokens
            await setAuthToken(data.token, data.refreshToken);
            router.push('/home');
          }
        } catch (error) {
          console.error('Firebase login error:', error);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [
          { scale: Animated.add(1, Animated.multiply(slideAnim, 0.1)) }
        ]
      }}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.contentContainer}>
            {/* Logo and app name */}
            <View style={styles.logoContainer}>
              <Ionicons name="camera" size={48} color="#1E88E5" />
              <Text style={styles.logoText}>Logo app</Text>
            </View>

            {/* Login title and subtitle */}
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Login to continue using the app</Text>

            {/* Email/phone input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                placeholder="Enter your email or phone number"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(''); // Clear error when user types
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                lablel='Email or phone number'
                readonly={isLoading}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Password input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, { outline: 'none' }, passwordError ? styles.inputError : null]}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(''); // Clear error when user types
                  }}
                  secureTextEntry={!showPassword}
                  readonly={isLoading}
                />
                <TouchableOpacity
                  style={[styles.eyeIcon, { flex: 0 }]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              <TouchableOpacity style={[styles.forgotPasswordContainer, { flex: 0 }]}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <AnimatedPressable
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={() => handleLogin("normal")}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </AnimatedPressable>

            {/* Social login options */}
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orLoginWith}>Or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Google Sign In Button */}
            <AnimatedPressable
              style={[styles.googleButton]}
              onPress={() => handleLogin("google")}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Image
                    source={require('../../assets/images/google-icon.png')}
                    style={[styles.googleIcon, { width: 24, height: 24 }]}
                  />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </AnimatedPressable>
          </View>

          {/* Register link */}
          <View style={styles.registerContainer}>
            <Text style={styles.noAccountText}>Don't have account? </Text>
            <TouchableOpacity onPress={() => router.push('register' as any)}>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
    fontWeight: '500'
  },
  input: {
    borderRadius: 15,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderRadius: 15,
    color: 'black'
  },
  eyeIcon: {
    padding: 12,
    justifyContent: 'center',
    flex: 0,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    flex: 0,
  },
  forgotPassword: {
    color: '#777',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    flex: 0,
  },
  loginButtonDisabled: {
    backgroundColor: '#1E88E5AA',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orLoginWith: {
    textAlign: 'center',
    color: '#777',
    marginHorizontal: 15,
    fontSize: 14,
  },
  facebookButton: {
    flexDirection: 'row',
    backgroundColor: '#E6F0FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#D8D7D7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    flex: 0,
  },
  googleButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  googleIcon: {
    marginRight: 8,
  },
  googleButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F2F2F2',
  },
  noAccountText: {
    color: '#777',
    fontSize: 14,
  },
  registerText: {
    color: '#1E88E5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});