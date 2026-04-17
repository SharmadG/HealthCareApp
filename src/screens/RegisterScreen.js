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

const RegisterScreen = ({navigation}) => {
  const {login} = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const formOpac = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formOpac, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(formSlide, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    if (confirmPass !== password) e.confirmPass = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const {user, token} = await authService.register(
        email.trim(),
        password,
        name.trim(),
      );
      await login(user, token);
      navigation.replace('Preloader');
    } catch (err) {
      console.log('firebase error:  ', err);

      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Teal header banner */}
        <LinearGradient
          colors={[COLORS.primaryDark, COLORS.primary]}
          style={styles.banner}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.bannerLogo}>
            <Text style={styles.logoCross}>✚</Text>
          </View>
          <Text style={styles.bannerTitle}>Create Account</Text>
          <Text style={styles.bannerSub}>Join Healthcare today</Text>
        </LinearGradient>

        <Animated.View
          style={[
            styles.formCard,
            {opacity: formOpac, transform: [{translateY: formSlide}]},
          ]}>
          <AppInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            error={errors.name}
            leftIcon={<Text style={styles.inputIcon}>👤</Text>}
            autoCapitalize="words"
          />

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
            placeholder="Min. 6 characters"
            secureText
            error={errors.password}
            leftIcon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <AppInput
            label="Confirm Password"
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Repeat password"
            secureText
            error={errors.confirmPass}
            leftIcon={<Text style={styles.inputIcon}>🔐</Text>}
          />

          <AppButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            gradient
            style={styles.registerBtn}
          />

          <View style={styles.loginWrap}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingTop: 56,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: SPACING.xl,
    padding: 8,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: '700',
  },
  bannerLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 12,
  },
  logoCross: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '900',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  bannerSub: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  formCard: {
    margin: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 40,
    marginTop: -20,
  },
  inputIcon: {
    fontSize: 16,
  },
  registerBtn: {
    marginTop: SPACING.sm,
  },
  loginWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.base,
  },
  loginText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
