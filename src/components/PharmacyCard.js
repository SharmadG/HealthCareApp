import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {COLORS, SIZES, SPACING} from '../utils/constants';

/**
 * PharmacyCard – displays a single pharmacy.
 *
 * Props:
 *  name       {string}
 *  distance   {string}  e.g. "5km Away"
 *  rating     {number}  e.g. 4.5
 *  reviews    {number}  e.g. 120
 *  imageUrl   {string}  remote image URL
 *  onPress    {func}
 */
const PharmacyCard = ({name, distance, rating, reviews, imageUrl, onPress}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handleIn = () =>
    Animated.spring(scale, {toValue: 0.97, useNativeDriver: true}).start();
  const handleOut = () =>
    Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();

  const stars = Math.round(rating);

  return (
    <Animated.View style={[styles.card, {transform: [{scale}]}]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handleIn}
        onPressOut={handleOut}>
        <Image
          source={{uri: imageUrl}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.distance}>📍 {distance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.starText}>
              {'★'.repeat(stars)}
              {'☆'.repeat(5 - stars)}
            </Text>
            <Text style={styles.ratingText}>
              {rating} ({reviews} review)
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    marginRight: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  info: {
    padding: SPACING.sm,
  },
  name: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  distance: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  starText: {
    fontSize: SIZES.xs,
    color: COLORS.accent,
    marginRight: 4,
  },
  ratingText: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
});

export default PharmacyCard;
