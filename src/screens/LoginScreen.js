import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {authService} from '../services/authService';
import {useAuth} from '../context/AuthContext';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import {COLORS, SIZES, SPACING} from '../utils/constants';

const LoginScreen = ({navigation}) => {
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animations
  const logoOpac = useRef(new Animated.Value(0)).current;
  const logoSlide = useRef(new Animated.Value(-40)).current;
  const formOpac = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpac, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoSlide, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(formOpac, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(formSlide, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6)
      e.password = 'Password must be ≥ 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const {user, token} = await authService.login(email.trim(), password);
      await login(user, token);
      navigation.replace('Preloader');
    } catch (err) {
      const msg =
        err.code === 'auth/user-not-found'
          ? 'No account found with this email.'
          : err.code === 'auth/wrong-password'
          ? 'Incorrect password.'
          : err.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Try again later.'
          : 'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first.');
      return;
    }
    try {
      await authService.forgotPassword(email.trim());
      Alert.alert(
        'Email Sent',
        'Check your inbox for password-reset instructions.',
      );
    } catch (_) {
      Alert.alert(
        'Error',
        'Could not send reset email. Check the address and try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Top decoration */}
        <LinearGradient
          colors={[COLORS.primaryLight + '30', COLORS.white]}
          style={styles.topDecor}
        />

        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {opacity: logoOpac, transform: [{translateY: logoSlide}]},
          ]}>
          <View style={styles.logoWrap}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              style={styles.logoCircle}>
              <Text style={styles.logoCross}>✚</Text>
            </LinearGradient>
          </View>
          <Text style={styles.loginLabel}>LOGIN</Text>
          <Text style={styles.appName}>Healthcare</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            styles.formCard,
            {opacity: formOpac, transform: [{translateY: formSlide}]},
          ]}>
          <AppInput
            label="Email ID"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            error={errors.email}
            leftIcon={<Text style={styles.inputIcon}>✉️</Text>}
          />

          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureText
            error={errors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot Password !</Text>
          </TouchableOpacity>

          <View style={styles.registerWrap}>
            <Text style={styles.registerText}>Don't Have an Account : </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Click here to register</Text>
            </TouchableOpacity>
          </View>

          <AppButton
            title="LOGIN"
            onPress={handleLogin}
            loading={loading}
            gradient
            style={styles.loginBtn}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  topDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
  },
  logoWrap: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoCross: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: '900',
  },
  loginLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    fontWeight: '600',
    marginBottom: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  formCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 40,
  },
  inputIcon: {
    fontSize: 16,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.base,
    marginTop: -4,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  registerWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    flexWrap: 'wrap',
  },
  registerText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
  loginBtn: {
    marginTop: SPACING.xs,
  },
});

export default LoginScreen;
