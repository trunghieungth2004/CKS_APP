import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './MenuButton.styles';

const MenuButton = ({ title, subtitle, onPress, icon, variant = 'default' }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[variant]]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Text style={[styles.title, styles[`${variant}Text`]]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

export default MenuButton;
