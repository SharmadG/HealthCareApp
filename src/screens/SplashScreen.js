import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../utils/constants';

const {width, height} = Dimensions.get('window');

/**
 * SplashScreen
 * Auto-navigates to PreloaderScreen after 2.5 s.
 */
const SplashScreen = ({navigation}) => {
  // Animation refs
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpac = useRef(new Animated.Value(0)).current;
  const textOpac = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;
  const taglineOpac = useRef(new Animated.Value(0)).current;
  const ripple1Scale = useRef(new Animated.Value(0.6)).current;
  const ripple1Opac = useRef(new Animated.Value(0.4)).current;
  const ripple2Scale = useRef(new Animated.Value(0.6)).current;
  const ripple2Opac = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Ripple loop
    const startRipple = (scaleRef, opacRef, delay) => {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleRef, {
              toValue: 1.6,
              duration: 1400,
              useNativeDriver: true,
            }),
            Animated.timing(opacRef, {
              toValue: 0,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleRef, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacRef, {
              toValue: 0.4,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      loop.start();
      return loop;
    };

    const r1 = startRipple(ripple1Scale, ripple1Opac, 0);
    const r2 = startRipple(ripple2Scale, ripple2Opac, 700);

    // Main entrance sequence
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(circleScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(circleOpac, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(textOpac, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(textSlide, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.timing(taglineOpac, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      r1.stop();
      r2.stop();
      navigation.replace('Preloader');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.white, '#EBF4F8', '#D4EAF2']}
      style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Ripple rings */}
      <Animated.View
        style={[
          styles.ripple,
          {
            opacity: ripple1Opac,
            transform: [{scale: ripple1Scale}],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ripple,
          styles.ripple2,
          {
            opacity: ripple2Opac,
            transform: [{scale: ripple2Scale}],
          },
        ]}
      />

      {/* Logo circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            opacity: circleOpac,
            transform: [{scale: circleScale}],
          },
        ]}>
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
          style={styles.circleGradient}
          start={{x: 0.2, y: 0}}
          end={{x: 0.8, y: 1}}>
          <Text style={styles.crossIcon}>✚</Text>
        </LinearGradient>
      </Animated.View>

      {/* App name */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textOpac,
            transform: [{translateY: textSlide}],
          },
        ]}>
        Healthcare
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, {opacity: taglineOpac}]}>
        Your Health, Our Priority
      </Animated.Text>

      {/* Bottom dots loader */}
      <Animated.View style={[styles.loader, {opacity: taglineOpac}]}>
        {[0, 1, 2].map(i => (
          <PulseDot key={i} delay={i * 200} />
        ))}
      </Animated.View>
    </LinearGradient>
  );
};

const PulseDot = ({delay}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return <Animated.View style={[styles.dot, {opacity}]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ripple2: {
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 14,
  },
  circleGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossIcon: {
    fontSize: 56,
    color: COLORS.white,
    fontWeight: '900',
  },
  appName: {
    marginTop: 28,
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  loader: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

export default SplashScreen;
