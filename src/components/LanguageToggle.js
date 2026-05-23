import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle({ style }) {
  const { language, setLanguage, texts } = useLanguage();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setLanguage('en')}
        style={[styles.segment, language === 'en' && styles.segmentActive]}
        activeOpacity={0.85}
      >
        <Text style={[styles.label, language === 'en' && styles.labelActive]}>{texts.common.english}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setLanguage('id')}
        style={[styles.segment, language === 'id' && styles.segmentActive]}
        activeOpacity={0.85}
      >
        <Text style={[styles.label, language === 'id' && styles.labelActive]}>{texts.common.indonesian}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1a3a78',
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    minWidth: 118,
    height: 34,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  segmentActive: {
    backgroundColor: '#243b7a',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#243b7a',
    letterSpacing: 0.5,
  },
  labelActive: {
    color: '#ffffff',
  },
});
