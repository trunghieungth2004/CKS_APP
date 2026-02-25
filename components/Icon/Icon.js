import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Modern icon component using Unicode symbols
const Icon = ({ name, size = 24, color = '#000', style }) => {
  const iconMap = {
    // Dashboard/Orders
    'dashboard': '■',
    'orders': '☰',
    'cart': '⊕',
    'box': '▢',
    
    // QC/Quality
    'check': '✓',
    'clipboard': '⊞',
    'quality': '◈',
    
    // Dispatch/Delivery
    'truck': '▶',
    'dispatch': '⇄',
    'delivery': '⇨',
    
    // Disputes/Issues
    'alert': '⚠',
    'dispute': '⚡',
    'flag': '⚑',
    
    // Management
    'users': '⚉',
    'settings': '⚙',
    'manage': '⊡',
    'chart': '▤',
    
    // Navigation
    'home': '⌂',
    'search': '⌕',
    'history': '⟲',
    'more': '⋯',
    
    // Actions
    'add': '+',
    'edit': '✎',
    'delete': '×',
    'back': '←',
    'forward': '→',
  };

  const iconChar = iconMap[name] || '?';

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Text style={[styles.icon, { fontSize: size * 0.8, color }]}>
        {iconChar}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: '300',
  },
});

export default Icon;
