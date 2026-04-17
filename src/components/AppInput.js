import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {COLORS, SIZES, SPACING} from '../utils/constants';

/**
 * AppInput – reusable floating-label text input.
 *
 * Props:
 *  label        {string}
 *  value        {string}
 *  onChangeText {func}
 *  placeholder  {string}
 *  error        {string}   - error message
 *  secureText   {bool}
 *  keyboardType {string}
 *  leftIcon     {node}
 *  rightIcon    {node}
 *  style        {object}
 *  inputStyle   {object}
 *  autoCapitalize {string}
 */
const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureText = false,
  keyboardType = 'default',
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  autoCapitalize = 'none',
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? COLORS.error : COLORS.border,
      error ? COLORS.error : COLORS.primary,
    ],
  });

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      ) : null}
      <Animated.View
        style={[
          styles.container,
          {borderColor},
          focused && styles.containerFocused,
          error && styles.containerError,
        ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeft,
            (rightIcon || secureText) && styles.inputWithRight,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureText && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {secureText ? (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setShowPass(!showPass)}>
            <Text style={styles.toggleText}>{showPass ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  labelError: {
    color: COLORS.error,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    minHeight: 52,
  },
  containerFocused: {
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  containerError: {
    borderColor: COLORS.error,
  },
  leftIcon: {
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
  },
  rightIcon: {
    paddingRight: SPACING.md,
    paddingLeft: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  inputWithLeft: {
    paddingLeft: 0,
  },
  inputWithRight: {
    paddingRight: 0,
  },
  toggleText: {
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.xs,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AppInput;
