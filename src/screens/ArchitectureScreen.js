import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ArchitectureScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arsitektur Tradisional</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../foto/rumah.jpg')}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>Rumah Adat Indonesia</Text>
          <Text style={styles.description}>
            Rumah adat Indonesia merupakan warisan budaya yang kaya dan beragam. Setiap daerah memiliki
            arsitektur unik yang mencerminkan nilai-nilai budaya, iklim, dan bahan baku lokal yang tersedia.
          </Text>

          <Text style={styles.sectionTitle}>Karakteristik Utama</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Desain yang disesuaikan dengan iklim tropis</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Menggunakan bahan-bahan alami lokal</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Penuh dengan ornamen dan makna filosofi</Text>
          </View>

          <LinearGradient
            colors={['#1a472a', '#2d6b42']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaSection}
          >
            <Text style={styles.ctaText}>Jelajahi lebih banyak tentang arsitektur tradisional</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Pelajari Selengkapnya →</Text>
            </TouchableOpacity>
          </LinearGradient>
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
    paddingVertical: 16,
    backgroundColor: '#1a472a',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4AF37',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 20,
    color: '#D4AF37',
    marginRight: 12,
    marginTop: -4,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  ctaSection: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  ctaText: {
    fontSize: 14,
    color: '#D4AF37',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  ctaButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a472a',
    textAlign: 'center',
  },
});
