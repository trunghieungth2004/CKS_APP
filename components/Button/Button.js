import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary', 
  style,
  textStyle,
  icon,
  compact = false,
}) => {
  const { paperTheme } = useTheme();
  const isDisabled = disabled || loading;

  const getModeAndColors = () => {
    switch (variant) {
      case 'primary':
        return { mode: 'contained', buttonColor: paperTheme.colors.primary };
      case 'secondary':
        return { mode: 'contained', buttonColor: paperTheme.colors.secondary };
      case 'success':
        return { mode: 'contained', buttonColor: paperTheme.colors.tertiary };
      case 'outline':
        return { mode: 'outlined', buttonColor: undefined };
      case 'text':
        return { mode: 'text', buttonColor: undefined };
      default:
        return { mode: 'contained', buttonColor: paperTheme.colors.primary };
    }
  };

  const { mode, buttonColor } = getModeAndColors();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={isDisabled}
      loading={loading}
      style={[styles.button, style]}
      contentStyle={[styles.content, compact && styles.compactContent]}
      labelStyle={[styles.label, textStyle]}
      buttonColor={buttonColor}
      icon={icon}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 4,
  },
  content: {
    paddingVertical: 6,
  },
  compactContent: {
    paddingVertical: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
