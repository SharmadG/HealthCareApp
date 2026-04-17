import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS, SIZES, SPACING} from '../utils/constants';

/**
 * AppButton – reusable button with press animation.
 *
 * Props:
 *  title        {string}   - button label
 *  onPress      {func}     - press handler
 *  loading      {bool}     - show spinner
 *  disabled     {bool}
 *  variant      {string}   - 'primary' | 'outline' | 'ghost'
 *  style        {object}   - extra container style
 *  textStyle    {object}   - extra text style
 *  gradient     {bool}     - use gradient background (primary only)
 *  icon         {node}     - optional left icon
 */
const AppButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  gradient = false,
  icon,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();
  };

  const isDisabled = disabled || loading;

  const containerStyles = [
    styles.base,
    variant === 'outline' && styles.outline,
    variant === 'ghost' && styles.ghost,
    isDisabled && styles.disabled,
    style,
  ];

  const labelStyles = [
    styles.label,
    variant === 'outline' && styles.labelOutline,
    variant === 'ghost' && styles.labelGhost,
    isDisabled && styles.labelDisabled,
    textStyle,
  ];

  const inner = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.white : COLORS.primary}
          size="small"
        />
      ) : (
        <>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={labelStyles}>{title}</Text>
        </>
      )}
    </View>
  );

  return (
    <Animated.View style={{transform: [{scale}]}}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={isDisabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={containerStyles}>
        {gradient && variant === 'primary' ? (
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.gradient]}>
            {inner}
          </LinearGradient>
        ) : (
          inner
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    borderRadius: 14,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
  },
  iconWrap: {
    marginRight: SPACING.sm,
  },
  label: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelOutline: {
    color: COLORS.primary,
  },
  labelGhost: {
    color: COLORS.primary,
  },
  labelDisabled: {
    opacity: 0.7,
  },
});

export default AppButton;
