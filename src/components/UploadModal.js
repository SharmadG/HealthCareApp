import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadFile, uploadFromUrl} from '../services/cloudinaryService';
import {COLORS, SIZES, SPACING} from '../utils/constants';
import AppButton from './AppButton';

/**
 * UploadModal – allows upload by file (device) or URL.
 *
 * Props:
 *  isVisible  {bool}
 *  onClose    {func}
 *  onSuccess  {func(result)}  called with Cloudinary result
 */
const UploadModal = ({isVisible, onClose, onSuccess}) => {
  const [mode, setMode] = useState('file'); // 'file' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchMode = m => {
    setMode(m);
    Animated.spring(slideAnim, {
      toValue: m === 'file' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const handlePickFile = async () => {
    try {
      // Try document picker first (PDFs + any file)
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      const file = {
        uri: result.fileCopyUri || result.uri,
        name: result.name,
        type: result.type,
      };

      await doUpload(file);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Could not pick file. Please try again.');
      }
    }
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length) {
      const asset = result.assets[0];
      const file = {uri: asset.uri, name: asset.fileName, type: asset.type};
      await doUpload(file);
    }
  };

  const doUpload = async file => {
    setLoading(true);
    setProgress(0);
    try {
      const cloudResult = await uploadFile(file, setProgress);
      onSuccess({...cloudResult, name: file.name});
      onClose();
    } catch (err) {
      Alert.alert('Upload Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim()) {
      Alert.alert('Error', 'Please enter a valid URL.');
      return;
    }
    setLoading(true);
    try {
      const cloudResult = await uploadFromUrl(urlInput.trim());
      onSuccess({...cloudResult, name: urlInput.split('/').pop()});
      setUrlInput('');
      onClose();
    } catch (err) {
      Alert.alert('Upload Failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const indicatorLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '52%'],
  });

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        {/* Handle */}
        <View style={styles.handle} />
        <Text style={styles.title}>Upload Prescription</Text>
        <Text style={styles.subtitle}>Accepted: PNG, JPG, JPEG, PDF</Text>

        {/* Tab toggle */}
        <View style={styles.tabs}>
          <Animated.View style={[styles.tabIndicator, {left: indicatorLeft}]} />
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchMode('file')}>
            <Text
              style={[styles.tabText, mode === 'file' && styles.tabTextActive]}>
              📁 Upload File
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => switchMode('url')}>
            <Text
              style={[styles.tabText, mode === 'url' && styles.tabTextActive]}>
              🔗 Upload Link
            </Text>
          </TouchableOpacity>
        </View>

        {/* File mode */}
        {mode === 'file' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.pickerBox}
              onPress={handlePickFile}
              disabled={loading}>
              <Text style={styles.pickerIcon}>📄</Text>
              <Text style={styles.pickerTitle}>Select PDF or Image</Text>
              <Text style={styles.pickerSub}>PNG, JPG, JPEG, PDF</Text>
            </TouchableOpacity>
            {loading && (
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, {width: `${progress}%`}]}
                  />
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>
            )}
          </View>
        )}

        {/* URL mode */}
        {mode === 'url' && (
          <View style={styles.section}>
            <View style={styles.urlInputWrap}>
              <TextInput
                style={styles.urlInput}
                placeholder="Paste document URL here…"
                placeholderTextColor={COLORS.gray}
                value={urlInput}
                onChangeText={setUrlInput}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
            <AppButton
              title="Upload from URL"
              onPress={handleUrlUpload}
              loading={loading}
              style={styles.uploadBtn}
              gradient
            />
          </View>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: SPACING.xl,
    paddingBottom: 40,
    paddingTop: SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.base,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.base,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.base,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '46%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
  section: {
    marginBottom: SPACING.base,
  },
  pickerBox: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  pickerIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  pickerTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  pickerSub: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressWrap: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.grayLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
  urlInputWrap: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  urlInput: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
  },
  uploadBtn: {
    marginTop: 4,
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
  },
  cancelText: {
    fontSize: SIZES.base,
    color: COLORS.gray,
    fontWeight: '600',
  },
});

export default UploadModal;
