import React, { useState, useRef } from 'react';
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

export default function FoodScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [foodName, setFoodName] = useState('Nama Makanan');
  const [description, setDescription] = useState(
    'Arahkan kamera ke makanan yang ingin Anda identifikasi'
  );
  const cameraRef = useRef(null);

  const handleCapture = async () => {
    setIsLoading(true);
    try {
      // Placeholder untuk implementasi camera capture
      // Nanti akan menggunakan expo-camera untuk mengambil foto
      Alert.alert('Info', 'Fitur kamera siap untuk integrasi dengan API model Comvis');

      // Simulasi loading
      setTimeout(() => {
        setIsLoading(false);
        setFoodName('Rendang');
        setDescription(
          'Rendang adalah hidangan tradisional Indonesia yang terdiri dari daging atau sayuran dalam saus santan kaya rempah yang menggugah selera.'
        );
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Gagal mengambil foto: ' + error.message);
    }
  };

  const handleReset = () => {
    setFoodName('Nama Makanan');
    setDescription('Arahkan kamera ke makanan yang ingin Anda identifikasi');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Food Name Title */}
        <Text style={styles.foodTitle}>{foodName}</Text>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text style={styles.loadingText}>Menganalisis...</Text>
              </View>
            ) : (
              <>
                {/* Camera Icon */}
                <View style={styles.cameraIcon}>
                  <Text style={styles.cameraIconText}>📷</Text>
                </View>

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
        <Text style={styles.instructionText}>
          Posisikan makanan di tengah frame untuk hasil identifikasi yang lebih akurat
        </Text>

        {/* Description Box */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionLabel}>Deskripsi</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {/* Button Group */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={sty2,
    backgroundColor: '#1a472a',
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
  foodTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 20,
    textAlign: 'center',
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
    color: '#666
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a472a',
    textAlign: 'center',
  },
  funFactBox: {
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  funFactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 20,
  },
});
