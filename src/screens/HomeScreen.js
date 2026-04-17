// src/screens/HomeScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import NearbyPharmacyTab from '../tabs/NearbyPharmacyTab';
import ReminderTab from '../tabs/ReminderTab';
import { COLORS, SIZES, SPACING } from '../utils/constants';

const QUICK_ACTIONS = [
  { id: '1', label: 'Questions', emoji: '❓' },
  { id: '2', label: 'Reminders', emoji: '🔔' },
  { id: '3', label: 'Messages', emoji: '💬' },
  { id: '4', label: 'Calendar', emoji: '📅' },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'reminder'

  // Animations
  const headerOpac   = useRef(new Animated.Value(0)).current;
  const headerSlide  = useRef(new Animated.Value(-30)).current;
  const actionsOpac  = useRef(new Animated.Value(0)).current;
  const bannerOpac   = useRef(new Animated.Value(0)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(headerOpac,  { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(headerSlide, { toValue: 0, friction: 8,   useNativeDriver: true }),
      ]),
      Animated.timing(actionsOpac, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(bannerOpac,  { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    Animated.spring(tabIndicator, {
      toValue: tab === 'nearby' ? 0 : 1,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const indicatorLeft = tabIndicator.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '52%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* ── Top Navigation Bar ── */}
      <Animated.View
        style={[
          styles.navbar,
          { opacity: headerOpac, transform: [{ translateY: headerSlide }] },
        ]}
      >
        {/* Hamburger */}
        <TouchableOpacity style={styles.menuBtn} onPress={handleLogout}>
          <View style={styles.hamburgerLine} />
          <View style={[styles.hamburgerLine, styles.hamburgerLineMid]} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>

        {/* App Logo */}
        <View style={styles.navLogo}>
          <LinearGradient
            colors={[COLORS.primaryLight, COLORS.primary]}
            style={styles.navLogoCircle}
          >
            <Text style={styles.navLogoCross}>✚</Text>
          </LinearGradient>
          <Text style={styles.navLogoText}>Healthy</Text>
        </View>

        {/* Mic button */}
        <TouchableOpacity style={styles.micBtn}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // make quick actions sticky
      >
        {/* ── Quick Actions Grid ── */}
        <Animated.View style={[styles.quickActions, { opacity: actionsOpac }]}>
          {QUICK_ACTIONS.map((action) => (
            <QuickActionButton
              key={action.id}
              label={action.label}
              emoji={action.emoji}
              onPress={() => {
                if (action.label === 'Reminders') switchTab('reminder');
              }}
            />
          ))}
        </Animated.View>

        {/* ── Tabs (Sticky) ── */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <Animated.View
              style={[styles.tabIndicatorBar, { left: indicatorLeft }]}
            />
            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchTab('nearby')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'nearby' && styles.tabTextActive,
                ]}
              >
                📍 Nearby Pharmacy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => switchTab('reminder')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'reminder' && styles.tabTextActive,
                ]}
              >
                🔔 Reminder
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Upload Prescription Banner ── */}
        <Animated.View style={[styles.prescriptionBanner, { opacity: bannerOpac }]}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>UPLOAD PRESCRIPTION</Text>
            <Text style={styles.bannerSubtext}>
              Upload a Prescription and Tell Us What you Need. We do the Rest. !
            </Text>
            <View style={styles.bannerDiscount}>
              <Text style={styles.discountText}>Flat 25% OFF ON{'\n'}MEDICINES</Text>
              <TouchableOpacity
                style={styles.orderBtn}
                onPress={() => switchTab('nearby')}
              >
                <Text style={styles.orderBtnText}>ORDER NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Promo Cards ── */}
        <Animated.View style={[styles.promoSection, { opacity: bannerOpac }]}>
          <PromoCard
            bg="#E8F5E9"
            title="Get the Best Medical Service"
            body="Premium healthcare at your fingertips, anytime, anywhere."
            emoji="👨‍⚕️"
          />
          <PromoCard
            bg="#EDE7F6"
            title="Up to 80% offer"
            subtitle="On Health Products"
            emoji="💊"
            isOffer
            offerValue="80 %"
            ctaLabel="SHOP NOW"
          />
        </Animated.View>
      </ScrollView>

      {/* ── Tab Content (outside ScrollView so it can scroll independently) ── */}
      <View style={styles.tabContent}>
        {activeTab === 'nearby'
          ? <NearbyPharmacyTab />
          : <ReminderTab navigation={navigation} />
        }
      </View>

      {/* ── Bottom Navigation Bar ── */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="🏠" active onPress={() => {}} />
        <BottomNavItem icon="📅" onPress={() => {}} />
        <BottomNavItem icon="📄" onPress={() => switchTab('nearby')} />
        <BottomNavItem icon="💬" onPress={() => {}} />
      </View>
    </View>
  );
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

const QuickActionButton = ({ label, emoji, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.quickBtn}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.9}
      >
        <Text style={styles.quickBtnEmoji}>{emoji}</Text>
        <Text style={styles.quickBtnLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PromoCard = ({ bg, title, body, subtitle, emoji, isOffer, offerValue, ctaLabel }) => (
  <View style={[styles.promoCard, { backgroundColor: bg }]}>
    {isOffer ? (
      <>
        <Text style={styles.promoOfferLabel}>UPTO</Text>
        <Text style={styles.promoOfferValue}>{offerValue}</Text>
        <Text style={styles.promoOfferSub}>{title}</Text>
        <Text style={styles.promoOfferSubtitle}>{subtitle}</Text>
        <TouchableOpacity style={styles.promoBtn}>
          <Text style={styles.promoBtnText}>{ctaLabel}</Text>
        </TouchableOpacity>
      </>
    ) : (
      <>
        <Text style={styles.promoTitle}>{title}</Text>
        <Text style={styles.promoBody}>{body}</Text>
      </>
    )}
    <Text style={styles.promoEmoji}>{emoji}</Text>
  </View>
);

const BottomNavItem = ({ icon, active, onPress }) => (
  <TouchableOpacity style={styles.bottomNavItem} onPress={onPress}>
    <Text style={[styles.bottomNavIcon, active && styles.bottomNavIconActive]}>
      {icon}
    </Text>
    {active && <View style={styles.bottomNavDot} />}
  </TouchableOpacity>
);

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: 52,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuBtn: {
    padding: 4,
    gap: 4,
  },
  hamburgerLine: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.textPrimary,
    marginVertical: 2,
  },
  hamburgerLineMid: {
    width: 16,
  },
  navLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  navLogoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLogoCross: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '900',
  },
  navLogoText: {
    fontSize: SIZES.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 18,
  },
  scroll: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    gap: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    gap: 6,
    backgroundColor: COLORS.white,
  },
  quickBtnEmoji: {
    fontSize: 16,
  },
  quickBtnLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 4,
    position: 'relative',
  },
  tabIndicatorBar: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '46%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  prescriptionBanner: {
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.base,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  bannerText: {},
  bannerTitle: {
    fontSize: SIZES.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  bannerSubtext: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  bannerDiscount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountText: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    lineHeight: 18,
  },
  orderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
  },
  orderBtnText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoSection: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.base,
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  promoCard: {
    borderRadius: 16,
    padding: SPACING.base,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 100,
  },
  promoTitle: {
    fontSize: SIZES.base,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  promoBody: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
    maxWidth: '70%',
  },
  promoEmoji: {
    position: 'absolute',
    right: SPACING.base,
    bottom: SPACING.sm,
    fontSize: 44,
  },
  promoOfferLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  promoOfferValue: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 40,
  },
  promoOfferSub: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  promoOfferSubtitle: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  promoBtn: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  promoBtnText: {
    color: COLORS.white,
    fontSize: SIZES.xs,
    fontWeight: '800',
  },
  tabContent: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  bottomNavIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  bottomNavIconActive: {
    opacity: 1,
  },
  bottomNavDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});

export default HomeScreen;
