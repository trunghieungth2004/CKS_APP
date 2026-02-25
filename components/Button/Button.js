import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary', 
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  // Safety check for theme
  if (!theme || !theme.colors || !theme.shadows || !theme.spacing || !theme.borderRadius) {
    return null;
  }

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors[variant] || theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md + 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.sm + 2,
      ...theme.shadows.medium,
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      };
    }

    if (isDisabled) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.text.disabled,
      };
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[
          styles.buttonText,
          { color: getTextColor() },
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Button;
