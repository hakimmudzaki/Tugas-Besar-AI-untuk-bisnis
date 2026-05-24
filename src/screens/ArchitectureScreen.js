import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ExpandableSection, InfoCard } from '../components/FoodDetailComponents';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { getHouseDetails } from '../services/architectureSearchService';
import { queryArchitectureHuggingFaceModel } from '../services/huggingFaceApi';

export default function ArchitectureScreen({ navigation }) {
  const { texts, language } = useLanguage();
  const text = texts.architecture;
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [houseName, setHouseName] = useState(text.defaultTitle);
  const [description, setDescription] = useState(text.instruction);
  const [houseDetails, setHouseDetails] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (predictedLabel) {
      const localizedDetails = getHouseDetails(predictedLabel, language);
      if (localizedDetails) {
        setHouseName(localizedDetails.nama);
        setDescription(localizedDetails.deskripsi);
        setHouseDetails(localizedDetails);
      }
      return;
    }

    setHouseName(text.defaultTitle);
    setDescription(text.instruction);
  }, [language, predictedLabel, text.defaultTitle, text.instruction]);

  const handleCapture = async () => {
    try {
      if (!cameraReady || !cameraRef.current) {
        Alert.alert('Info', text.cameraNotReady);
        return;
      }

      if (!permission?.granted) {
        await requestPermission();
        Alert.alert('Izin kamera diperlukan', text.cameraPermissionNeed);
        return;
      }

      const capturedPhoto = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      setIsLoading(true);

      if (!capturedPhoto?.uri) {
        Alert.alert('Info', text.cameraWait);
        return;
      }

      const prediction = await queryArchitectureHuggingFaceModel(capturedPhoto.uri);
      const predictedHouseName = prediction?.foodName || 'Banten';
      const confidenceScore = prediction?.confidence || 0;
      const details = getHouseDetails(predictedHouseName, language);
      setPredictedLabel(predictedHouseName);

      if (details) {
        setHouseName(details.nama);
        setDescription(details.deskripsi);
        setHouseDetails(details);
        setConfidence((confidenceScore * 100).toFixed(1));
      } else {
        Alert.alert('Info', text.infoNotFound);
        setHouseName(text.defaultTitle);
        setDescription(text.infoNotFoundDesc);
        setHouseDetails(null);
      }
    } catch (error) {
      Alert.alert('Error', `${text.errorAnalyzePrefix}${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictedLabel(null);
    setHouseName(text.defaultTitle);
    setDescription(text.instruction);
    setHouseDetails(null);
    setConfidence(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{texts.common.back}</Text>
          </TouchableOpacity>
          <LanguageToggle />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.houseTitle}>{houseName}</Text>
          {confidence > 0 && <Text style={styles.confidenceText}>{text.confidencePrefix}: {confidence}%</Text>}
        </View>

        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            {!permission ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>{text.loading}</Text>
              </View>
            ) : !permission.granted ? (
              <View style={styles.permissionContainer}>
                <Text style={styles.permissionTitle}>{text.permissionTitle}</Text>
                <Text style={styles.permissionText}>{text.permissionText}</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                  <Text style={styles.permissionButtonText}>{text.permissionButton}</Text>
                </TouchableOpacity>
              </View>
            ) : isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>{text.analyzing}</Text>
              </View>
            ) : (
              <>
                <CameraView
                  ref={cameraRef}
                  style={styles.cameraPreview}
                  facing="back"
                  onCameraReady={() => setCameraReady(true)}
                />

                <View style={styles.cornerMarker}>
                  <View style={[styles.corner, styles.topLeft]} />
                </View>
                <View style={styles.cornerMarker}>
                  <View style={[styles.corner, styles.topRight]} />
                </View>
                <View style={styles.cornerMarker}>
                  <View style={[styles.corner, styles.bottomLeft]} />
                </View>
                <View style={styles.cornerMarker}>
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>

                <View style={styles.crosshair}>
                  <View style={styles.crosshairH} />
                  <View style={styles.crosshairV} />
                </View>
              </>
            )}
          </View>
        </View>

        <Text style={styles.instructionText}>{text.instruction}</Text>

        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionLabel}>{text.descriptionLabel}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {houseDetails && (
          <View style={styles.detailsSection}>
            <View style={styles.quickInfoRow}>
              <InfoCard label={text.details.tribe} value={houseDetails.suku} />
            </View>
            <InfoCard label={text.details.sacredness} value={houseDetails.kesakralan} color="#1a472a" />

            <ExpandableSection title={text.details.description} content={houseDetails.deskripsi || text.details.noData} />
            <ExpandableSection title={text.details.physical} content={houseDetails.spesifikasi || text.details.noData} />
            <ExpandableSection title={text.details.taboos} content={houseDetails.pantangan || text.details.noData} />
            <ExpandableSection title={text.details.materials} content={houseDetails.material || text.details.noData} />
            <ExpandableSection title={text.details.process} content={houseDetails.proses || text.details.noData} />
            <ExpandableSection title={text.details.philosophy} content={houseDetails.filosofi || text.details.noData} />
            <ExpandableSection title={text.details.etiquette} content={houseDetails.tataKrama || text.details.noData} expanded={false} />
          </View>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isLoading || !permission?.granted || !cameraReady}
          >
            <LinearGradient
              colors={['#1a472a', '#2d6b42']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.captureButtonGradient}
            >
              <Text style={styles.captureButtonText}>
                {isLoading ? text.analyzing : !permission?.granted ? text.permissionButton : !cameraReady ? text.loading : text.capture}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {houseName !== text.defaultTitle && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <LinearGradient
                colors={['#999999', '#b3b3b3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resetButtonGradient}
              >
                <Text style={styles.resetButtonText}>{text.tryAgain}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{text.tipsTitle}</Text>
          <Text style={styles.infoText}>
            • {text.tip1}{'\n'}
            • {text.tip2}{'\n'}
            • {text.tip3}{'\n'}
            • {text.tip4}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 12,
    backgroundColor: '#1a472a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  image: {
    width: '100%',
    height: 300,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  houseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  confidenceText: {
    fontSize: 12,
    color: '#D4AF37',
    marginTop: 4,
    fontWeight: '600',
  },
  cameraContainer: {
    marginBottom: 16,
  },
  cameraPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#999',
  },
  cameraPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a472a',
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionText: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    color: '#666',
  },
  permissionButton: {
    backgroundColor: '#1a472a',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#D4AF37',
    fontWeight: '600',
  },
  cornerMarker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  corner: {
    width: 40,
    height: 40,
    borderColor: '#333',
    position: 'absolute',
  },
  topLeft: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    top: 12,
    left: 12,
  },
  topRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    top: 12,
    right: 12,
  },
  bottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    bottom: 12,
    left: 12,
  },
  bottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    bottom: 12,
    right: 12,
  },
  crosshair: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairH: {
    position: 'absolute',
    width: 60,
    height: 2,
    backgroundColor: '#D4AF37',
  },
  crosshairV: {
    position: 'absolute',
    width: 2,
    height: 60,
    backgroundColor: '#D4AF37',
  },
  instructionText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  descriptionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a472a',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 10,
  },
  quickInfoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  buttonGroup: {
    gap: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  captureButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  captureButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resetButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
