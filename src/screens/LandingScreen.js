import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const { texts } = useLanguage();
  const text = texts.landing;
  const [activeSection, setActiveSection] = useState('home');

  const handleGetStarted = () => {
    navigation.navigate('HomeMenu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.languageWrapper}>
            <LanguageToggle />
          </View>
          <Image
            source={require('../../foto/rumah.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>AKSANUSA</Text>
              <Text style={styles.heroSubtitle}>{text.heroSubtitle}</Text>
              <Text style={styles.heroDescription}>{text.heroDescription}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted}>
            <LinearGradient
              colors={['#8B6914', '#D4AF37']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>{texts.common.getStarted}</Text>
              <Text style={styles.ctaArrow}>  </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Call to Action Section */}
        <LinearGradient
          colors={['#1a472a', '#2d6b42']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.finalCTASection}
        >
          <Text style={styles.finalCTATitle}>{text.readyTitle}</Text>
          <Text style={styles.finalCTADescription}>{text.readyDescription}</Text>
          <TouchableOpacity style={styles.downloadButton} onPress={handleGetStarted}>
            <Text style={styles.downloadButtonText}>{texts.common.startExploring}</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 AKSANUSA</Text>
          <Text style={styles.footerSubtext}>{text.footerText}</Text>
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
  heroSection: {
    width: '100%',
    height: height * 0.5,
    position: 'relative',
  },
  languageWrapper: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    color: '#D4AF37',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    textAlign: 'center',
  },
  ctaSection: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaButton: {
    width: '80%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  ctaArrow: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 8,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a472a',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  showcaseSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  showcaseImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginVertical: 16,
  },
  showcaseContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: -20,
    marginHorizontal: 0,
  },
  showcaseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
  },
  showcaseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a472a',
  },
  architectureSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  archCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  archImage: {
    width: '100%',
    height: 240,
  },
  archContent: {
    padding: 20,
  },
  archTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 8,
  },
  archDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  finalCTASection: {
  marginHorizontal: 20,
  borderRadius: 16,
  padding: 30,
  marginTop: 10,    
  marginBottom: 40, 
  alignItems: 'center',
},
  finalCTATitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  finalCTADescription: {
    fontSize: 14,
    color: '#d4af37',
    marginBottom: 20,
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a472a',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
