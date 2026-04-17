import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import {COLORS, SIZES, SPACING} from '../utils/constants';

/**
 * PrescriptionCard – shows a single uploaded prescription in the Reminder tab.
 *
 * Props:
 *  item     { url, format, name, createdAt, bytes }
 *  onDelete {func}
 */
const PrescriptionCard = ({item, onDelete}) => {
  const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(
    (item.format || '').toLowerCase(),
  );

  const fileIcon = isImage ? '🖼️' : '📄';
  const label =
    item.name || `Prescription_${item.createdAt?.slice(0, 10) || ''}`;
  const size = item.bytes
    ? item.bytes > 1024 * 1024
      ? `${(item.bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(item.bytes / 1024)} KB`
    : '';

  const formattedDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{fileIcon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.meta}>
          {formattedDate}
          {size ? `  •  ${size}` : ''}
        </Text>
        <Text style={styles.format}>{(item.format || '').toUpperCase()}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => Linking.openURL(item.url)}>
          <Text style={styles.viewBtnText}>View</Text>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(item)}>
            <Text style={styles.deleteBtnText}>🗑</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  meta: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  format: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    alignItems: 'center',
    gap: 6,
  },
  viewBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewBtnText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 16,
  },
});

export default PrescriptionCard;
