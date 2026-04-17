// src/utils/constants.js

export const COLORS = {
  primary: '#4A90A4',
  primaryDark: '#2C6E82',
  primaryLight: '#7BB8C8',
  secondary: '#5CC8A0',
  accent: '#F0A500',
  background: '#F8FAFB',
  white: '#FFFFFF',
  black: '#1A1A2E',
  gray: '#8A9BB0',
  grayLight: '#E8EEF3',
  grayDark: '#4A5568',
  error: '#E53E3E',
  success: '#38A169',
  warning: '#D69E2E',
  cardBg: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7A8D',
  border: '#DDE4EC',
  shadow: 'rgba(74, 144, 164, 0.15)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  huge: 36,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// ─── Replace these with your actual keys ───────────────────────────────────
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'YOUR_CLOUD_NAME',         // e.g. 'dxyz123abc'
  UPLOAD_PRESET: 'YOUR_UPLOAD_PRESET',   // unsigned upload preset name
  API_URL: 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload',
};

// Firebase is configured via google-services.json / GoogleService-Info.plist
// No keys needed here when using @react-native-firebase

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@healthcare_auth_token',
  USER_DATA: '@healthcare_user_data',
  PRESCRIPTIONS: '@healthcare_prescriptions',
};
