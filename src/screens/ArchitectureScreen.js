import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function ArchitectureScreen({ navigation }) {
  const { texts } = useLanguage();
  const text = texts.architecture;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{texts.common.back}</Text>
          </TouchableOpacity>
          <LanguageToggle />
        </View>
        <Text style={styles.headerTitle}>{text.headerTitle}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../foto/rumah.jpg')}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{text.title}</Text>
          <Text style={styles.description}>{text.description}</Text>

          <Text style={styles.sectionTitle}>{text.sectionTitle}</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>{text.bullet1}</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>{text.bullet2}</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>{text.bullet3}</Text>
          </View>

          <LinearGradient
            colors={['#1a472a', '#2d6b42']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaSection}
          >
            <Text style={styles.ctaText}>{text.ctaText}</Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>{text.ctaButton}</Text>
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
    paddingBottom: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    backgroundColor: '#1a472a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  backButton: {
    paddingVertical: 4,
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
