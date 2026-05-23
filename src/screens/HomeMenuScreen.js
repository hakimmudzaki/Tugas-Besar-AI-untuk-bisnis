import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function HomeMenuScreen({ navigation }) {
  const { texts } = useLanguage();
  const text = texts.home;

  const menuItems = [
    {
      id: 1,
      title: text.architecture.title,
      icon: '🏛️',
      color: '#1a472a',
      description: text.architecture.description,
      screen: 'Architecture',
      disabled: true,
    },
    {
      id: 2,
      title: text.chatbot.title,
      icon: '💬',
      color: '#2d6b42',
      description: text.chatbot.description,
      screen: 'Chatbot',
      disabled: false,
    },
    {
      id: 3,
      title: text.food.title,
      icon: '🍲',
      color: '#3d7d52',
      description: text.food.description,
      screen: 'Food',
      disabled: false,
    },
  ];

  const handleMenuPress = (screen, disabled) => {
    if (!disabled) {
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerTitleBlock}>
              <Text style={styles.headerTitle}>{text.title}</Text>
              <Text style={styles.headerSubtitle}>{text.subtitle}</Text>
            </View>
            <LanguageToggle />
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuPress(item.screen, item.disabled)}
              activeOpacity={item.disabled ? 1 : 0.85}
              disabled={item.disabled}
            >
              <LinearGradient
                colors={item.disabled ? ['#9ca3af', '#c4c4c4'] : [item.color, '#5f9f6f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.menuItem, item.disabled && styles.menuItemDisabled]}
              >
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#D4AF37', '#B8860B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconCircle}
                  >
                    <Text style={styles.icon}>{item.icon}</Text>
                  </LinearGradient>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                  {item.disabled && <Text style={styles.comingSoonText}>{texts.common.comingSoon}</Text>}
                </View>

                <Text style={[styles.arrow, item.disabled && styles.arrowDisabled]}>
                  {item.disabled ? '' : ''}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>{text.aboutTitle}</Text>
          <Text style={styles.infoText}>{text.aboutText}</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTitleBlock: {
    flex: 1,
    paddingRight: 8,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1a472a',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItemDisabled: {
    opacity: 0.7,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 36,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#eef6ef',
    lineHeight: 18,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#ffeb3b',
    fontStyle: 'italic',
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: '#D4AF37',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  arrowDisabled: {
    color: '#666666',
  },
  infoSection: {
    marginHorizontal: 20,
    marginVertical: 30,
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
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
