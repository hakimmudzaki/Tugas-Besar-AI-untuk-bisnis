import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const ExpandableSection = ({ title, content, icon = '▼', expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#1a472a', '#2d6b42']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.icon}>{isExpanded ? '▲' : '▼'}</Text>
          <Text style={styles.title}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

export const InfoCard = ({ label, value, color = '#D4AF37' }) => {
  return (
    <View style={styles.infoCard}>
      <Text style={[styles.infoLabel, { color }]}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export const SpiceLevelBadge = ({ level, size = 'medium' }) => {
  const levelNum = parseInt(level);
  const getLevelColor = () => {
    if (levelNum <= 1) return '#2d6b42';
    if (levelNum === 2) return '#D4AF37';
    if (levelNum === 3) return '#FF9500';
    if (levelNum === 4) return '#FF6B35';
    return '#FF0000';
  };

  const getSize = () => {
    return size === 'small' ? 24 : size === 'medium' ? 32 : 40;
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getLevelColor(),
          width: getSize(),
          height: getSize(),
        },
      ]}
    >
      <Text style={styles.badgeText}>{level}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 16,
    color: '#D4AF37',
    marginRight: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  content: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  badge: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
