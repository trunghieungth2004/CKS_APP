import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const MenuButton = ({ title, subtitle, onPress, icon, variant = 'default' }) => {
  const { theme } = useTheme();

  // Safety check for theme
  if (!theme || !theme.colors || !theme.shadows || !theme.colors.border || !theme.colors.text) {
    return null;
  }

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'danger':
        return theme.colors.danger;
      default:
        return theme.colors.text.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border.light,
          ...theme.shadows.small,
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: getVariantColor() }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Text style={[styles.arrow, { color: theme.colors.text.tertiary }]}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 28,
    fontWeight: '300',
  },
});

export default MenuButton;
