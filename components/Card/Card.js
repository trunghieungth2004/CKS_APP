import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ title, children, onPress, style }) => {
  const { theme } = useTheme();
  const Container = onPress ? TouchableOpacity : View;
  
  // Safety check for theme
  if (!theme || !theme.colors || !theme.shadows || !theme.colors.border || !theme.colors.text) {
    return null;
  }
  
  return (
    <Container 
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border.light,
          ...theme.shadows.small,
        },
        style
      ]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && (
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
      )}
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
});

export default Card;
