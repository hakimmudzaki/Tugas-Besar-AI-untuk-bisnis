import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ExpandableSection, InfoCard, SpiceLevelBadge } from '../components/FoodDetailComponents';
import { getFoodDetails } from '../services/foodSearchService';
import { queryHuggingFaceModel } from '../services/huggingFaceApi';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function FoodScreen({ navigation }) {
  const { texts, language } = useLanguage();
  const text = texts.food;
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [foodName, setFoodName] = useState(text.defaultTitle);
  const [description, setDescription] = useState(text.instruction);
  const [foodDetails, setFoodDetails] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [lastPredictedFoodName, setLastPredictedFoodName] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (lastPredictedFoodName) {
      const refreshedDetails = getFoodDetails(lastPredictedFoodName, language);
      if (refreshedDetails) {
        setFoodName(refreshedDetails.nama);
        setDescription(refreshedDetails.deskripsi);
        setFoodDetails(refreshedDetails);
      }
      return;
    }

    setFoodName(text.defaultTitle);
    setDescription(text.instruction);
  }, [language]);

  const handleCapture = async () => {
    try {
      if (!cameraReady || !cameraRef.current) {
        Alert.alert('Info', text.cameraNotReady);
        return;
      }

      if (!permission?.granted) {
        await requestPermission();
        Alert.alert(text.permissionTitle, text.cameraPermissionNeed);
        return;
      }

      const capturedPhoto = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      setIsLoading(true);

      if (!capturedPhoto?.uri) {
        Alert.alert('Info', text.cameraWait);
        return;
      }

      const prediction = await queryHuggingFaceModel(capturedPhoto.uri);
      const predictedFoodName = prediction?.foodName || 'Rendang';
      const confidenceScore = prediction?.confidence || 0;
      setLastPredictedFoodName(predictedFoodName);

      // Search food details from JSON
      const details = getFoodDetails(predictedFoodName, language);

      if (details) {
        setFoodName(details.nama);
        setDescription(details.deskripsi);
        setFoodDetails(details);
        setConfidence((confidenceScore * 100).toFixed(1));
      } else {
        Alert.alert('Info', text.infoNotFound);
        setFoodName(text.defaultTitle);
        setDescription(text.infoNotFoundDesc);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', text.errorAnalyzePrefix + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFoodName(text.defaultTitle);
    setDescription(text.instruction);
    setFoodDetails(null);
    setConfidence(0);
    setLastPredictedFoodName(null);
    setCameraReady(false);
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
        {/* Food Name Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.foodTitle}>{foodName}</Text>
          {confidence > 0 && <Text style={styles.confidenceText}>{text.confidencePrefix}: {confidence}%</Text>}
        </View>

        {/* Camera View */}
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

                {/* Camera Icon */}
                

                {/* Corner Markers */}
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

                {/* Crosshair */}
                <View style={styles.crosshair}>
                  <View style={styles.crosshairH} />
                  <View style={styles.crosshairV} />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Instruction Text */}
        <Text style={styles.instructionText}>{text.instruction}</Text>

        {/* Description Box */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionLabel}>{text.descriptionLabel}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {/* Food Details Section */}
        {foodDetails && (
          <View style={styles.detailsSection}>
            {/* Quick Info Row */}
            <View style={styles.quickInfoRow}>
              <InfoCard label={text.details.origin} value={foodDetails.daerahAsal} />
              <View style={styles.spiceContainer}>
                <Text style={styles.spiceLabel}>{text.details.spice}</Text>
                <SpiceLevelBadge level={foodDetails.spiciness} size="large" />
              </View>
            </View>

            {/* Expandable Sections */}
            <ExpandableSection
              title={text.details.ingredients}
              content={foodDetails.bahanUtama}
            />

            <ExpandableSection title={text.details.howToMake} content={foodDetails.caraMembuat} />

            <ExpandableSection
              title={text.details.nutrition}
              content={foodDetails.kalori}
            />

            <ExpandableSection
              title={text.details.allergens}
              content={foodDetails.alergen === '-' ? text.details.noAllergen : foodDetails.alergen}
            />

            <ExpandableSection title={text.details.philosophy} content={foodDetails.filosofi} />

            <ExpandableSection
              title={text.details.etiquette}
              content={foodDetails.caraMakan}
              expanded={false}
            />
          </View>
        )}

        {/* Button Group */}
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
                {isLoading
                  ? text.analyzing
                  : !permission?.granted
                  ? text.permissionButton
                  : !cameraReady
                  ? text.cameraReady
                  : text.capture}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {foodName !== 'Nama Makanan' && (
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

        {/* Info Section */}
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
    paddingVertical: 12,
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  foodTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
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
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
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
  cameraIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  cameraIconText: {
    fontSize: 32,
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
    backgroundColor: '#333',
  },
  crosshairV: {
    position: 'absolute',
    width: 2,
    height: 60,
    backgroundColor: '#333',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  descriptionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  detailsSection: {
    marginBottom: 20,
  },
  quickInfoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  spiceContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spiceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  captureButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  captureButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  captureIcon: {
    fontSize: 24,
  },
  captureButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resetButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
});
