// src/tabs/NearbyPharmacyTab.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PharmacyCard from '../components/PharmacyCard';
import UploadModal from '../components/UploadModal';
import AppButton from '../components/AppButton';
import { storageService } from '../services/storageService';
import { COLORS, SIZES, SPACING } from '../utils/constants';

const PHARMACIES = [
  {
    id: '1',
    name: 'Path lab pharmacy',
    distance: '5km Away',
    rating: 4.5,
    reviews: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  },
  {
    id: '2',
    name: '24 Pharmacy',
    distance: '5km Away',
    rating: 4.5,
    reviews: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80',
  },
  {
    id: '3',
    name: 'MediPlus Store',
    distance: '3km Away',
    rating: 4.2,
    reviews: 85,
    imageUrl:
      'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&q=80',
  },
];

const NearbyPharmacyTab = () => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [prescriptions, setPrescriptions]           = useState([]);

  const headerOpac  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const listOpac    = useRef(new Animated.Value(0)).current;
  const uploadOpac  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load saved prescriptions
    storageService.getPrescriptions().then(setPrescriptions);

    // Staggered entrance
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerOpac,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(headerSlide, { toValue: 0, friction: 8,   useNativeDriver: true }),
      ]),
      Animated.timing(listOpac,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(uploadOpac, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleUploadSuccess = async (result) => {
    const updated = await storageService.addPrescription(result);
    setPrescriptions(updated);
    Alert.alert('✅ Uploaded', 'Prescription uploaded successfully!');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Location header */}
      <Animated.View
        style={[
          styles.locationRow,
          { opacity: headerOpac, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>Mohali</Text>
      </Animated.View>

      {/* Section title */}
      <Animated.View style={{ opacity: headerOpac }}>
        <Text style={styles.sectionTitle}>Pharmacy Nearby</Text>
      </Animated.View>

      {/* Horizontal pharmacy list */}
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pharmacyList}
        style={[styles.pharmacyScroll, { opacity: listOpac }]}
      >
        {PHARMACIES.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            {...pharmacy}
            onPress={() => Alert.alert(pharmacy.name, `${pharmacy.distance} • ⭐ ${pharmacy.rating}`)}
          />
        ))}
      </Animated.ScrollView>

      {/* Upload Prescription section */}
      <Animated.View style={[styles.uploadCard, { opacity: uploadOpac }]}>
        <Text style={styles.uploadTitle}>Upload Prescription</Text>
        <Text style={styles.uploadSub}>
          We will show the pharmacy that fits as per your prescription.
        </Text>

        <View style={styles.uploadOptions}>
          {/* Upload Link option */}
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => setUploadModalVisible(true)}
          >
            <View style={styles.uploadIcon}>
              <Text style={styles.uploadIconEmoji}>📎</Text>
            </View>
            <Text style={styles.uploadOptionText}>Upload Link</Text>
          </TouchableOpacity>

          {/* Upload File option */}
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => setUploadModalVisible(true)}
          >
            <View style={styles.uploadIcon}>
              <Text style={styles.uploadIconEmoji}>⬆️</Text>
            </View>
            <Text style={styles.uploadOptionText}>Upload File</Text>
          </TouchableOpacity>
        </View>

        <AppButton
          title="Continue"
          onPress={() => setUploadModalVisible(true)}
          gradient
          style={styles.continueBtn}
        />
      </Animated.View>

      {/* Recent uploads count badge */}
      {prescriptions.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            📋 {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''} uploaded
          </Text>
        </View>
      )}

      <UploadModal
        isVisible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onSuccess={handleUploadSuccess}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 40,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  pharmacyScroll: {
    marginBottom: SPACING.lg,
  },
  pharmacyList: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  uploadCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.xl,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  uploadTitle: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  uploadSub: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  uploadOption: {
    alignItems: 'center',
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.sm,
  },
  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  uploadIconEmoji: {
    fontSize: 24,
  },
  uploadOptionText: {
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: COLORS.secondary,
  },
  badge: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.base,
    backgroundColor: COLORS.secondary + '20',
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: SIZES.sm,
    color: COLORS.secondary,
    fontWeight: '700',
  },
});

export default NearbyPharmacyTab;
