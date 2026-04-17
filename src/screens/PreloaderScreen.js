import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../utils/constants';
import {useAuth} from '../context/AuthContext';

/**
 * PreloaderScreen
 * Shown briefly after splash while auth state resolves.
 * Navigates to Login (unauthenticated) or Home (authenticated).
 */
const PreloaderScreen = ({navigation}) => {
  const {user, loading} = useAuth();

  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const logoOpac = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const textOpac = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpac, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Spinner
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 2200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Text
    setTimeout(
      () =>
        Animated.timing(textOpac, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start(),
      400,
    );
  }, []);

  // Navigate after auth resolves and progress bar finishes
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      navigation.replace(user ? 'Home' : 'Login');
    }, 2400);
    return () => clearTimeout(timer);
  }, [loading, user]);

  const rotation = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const messages = [
    'Loading your health data…',
    'Setting up your profile…',
    'Almost ready…',
  ];
  const msgIndex = useRef(0);
  const [message, setMessage] = React.useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      msgIndex.current = (msgIndex.current + 1) % messages.length;
      setMessage(messages[msgIndex.current]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primary, COLORS.primaryLight]}
      style={styles.container}
      start={{x: 0.2, y: 0}}
      end={{x: 0.8, y: 1}}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Decorative circles */}
      <View style={[styles.decCircle, styles.decCircle1]} />
      <View style={[styles.decCircle, styles.decCircle2]} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: logoOpac,
            transform: [{scale: logoScale}],
          },
        ]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>✚</Text>
        </View>
      </Animated.View>

      {/* App name */}
      <Animated.Text style={[styles.appName, {opacity: textOpac}]}>
        Healthcare
      </Animated.Text>

      {/* Spinner */}
      <Animated.View
        style={[styles.spinner, {transform: [{rotate: rotation}]}]}
      />

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, {width: progressWidth}]} />
      </View>

      <Animated.Text style={[styles.loadingMsg, {opacity: textOpac}]}>
        {message}
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  decCircle1: {
    width: 340,
    height: 340,
    top: -80,
    right: -80,
  },
  decCircle2: {
    width: 260,
    height: 260,
    bottom: -60,
    left: -60,
  },
  logoWrap: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  logoText: {
    fontSize: 48,
    color: COLORS.white,
    fontWeight: '900',
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.3,
    marginBottom: 36,
  },
  spinner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
    borderTopColor: COLORS.white,
    marginBottom: 32,
  },
  progressTrack: {
    width: '65%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  loadingMsg: {
    marginTop: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
  },
});

export default PreloaderScreen;
