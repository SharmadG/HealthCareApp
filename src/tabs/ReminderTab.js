// src/tabs/ReminderTab.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrescriptionCard from '../components/PrescriptionCard';
import { storageService } from '../services/storageService';
import { COLORS, SIZES, SPACING } from '../utils/constants';

const ReminderTab = ({ navigation }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const listOpac    = useRef(new Animated.Value(0)).current;
  const emptyScale  = useRef(new Animated.Value(0.8)).current;
  const emptyOpac   = useRef(new Animated.Value(0)).current;

  // Reload whenever this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPrescriptions();
    }, [])
  );

  const loadPrescriptions = async () => {
    const data = await storageService.getPrescriptions();
    setPrescriptions(data);
    setLoading(false);

    if (data.length === 0) {
      Animated.parallel([
        Animated.spring(emptyScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(emptyOpac,  { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(listOpac, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Prescription',
      'Are you sure you want to remove this prescription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = prescriptions.filter((p) => p.publicId !== item.publicId && p.url !== item.url);
            await storageService.savePrescriptions(updated);
            setPrescriptions(updated);
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <AnimatedCard index={index}>
      <PrescriptionCard item={item} onDelete={() => handleDelete(item)} />
    </AnimatedCard>
  );

  if (loading) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Prescriptions</Text>
        <Text style={styles.subtitle}>
          {prescriptions.length} document{prescriptions.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {/* Stats row */}
      {prescriptions.length > 0 && (
        <View style={styles.statsRow}>
          <StatChip
            icon="📄"
            label="Total"
            value={prescriptions.length}
            color={COLORS.primary}
          />
          <StatChip
            icon="🖼️"
            label="Images"
            value={prescriptions.filter((p) =>
              ['jpg', 'jpeg', 'png'].includes((p.format || '').toLowerCase())
            ).length}
            color={COLORS.secondary}
          />
          <StatChip
            icon="📑"
            label="PDFs"
            value={prescriptions.filter((p) =>
              (p.format || '').toLowerCase() === 'pdf'
            ).length}
            color={COLORS.accent}
          />
        </View>
      )}

      {prescriptions.length === 0 ? (
        /* Empty state */
        <Animated.View
          style={[
            styles.emptyWrap,
            { opacity: emptyOpac, transform: [{ scale: emptyScale }] },
          ]}
        >
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No Prescriptions Yet</Text>
          <Text style={styles.emptyText}>
            Upload your prescriptions from the{'\n'}Nearby Pharmacy tab.
          </Text>
          <TouchableOpacity
            style={styles.uploadNowBtn}
            onPress={() => navigation.navigate('Home', { screen: 'NearbyPharmacy' })}
          >
            <Text style={styles.uploadNowText}>Upload Now →</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: listOpac }}>
          <FlatList
            data={prescriptions}
            keyExtractor={(item, index) => item.publicId || item.url || String(index)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </View>
  );
};

/** Staggered entrance for list items */
const AnimatedCard = ({ children, index }) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

const StatChip = ({ icon, label, value, color }) => (
  <View style={[styles.chip, { borderColor: color + '40', backgroundColor: color + '10' }]}>
    <Text style={styles.chipIcon}>{icon}</Text>
    <Text style={[styles.chipValue, { color }]}>{value}</Text>
    <Text style={styles.chipLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  chip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  chipIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  chipValue: {
    fontSize: SIZES.xl,
    fontWeight: '800',
  },
  chipLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.base,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadNowBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 14,
  },
  uploadNowText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '700',
  },
});

export default ReminderTab;
