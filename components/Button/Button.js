import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styles from './Button.styles';

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary', 
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, styles[`${variant}Text`], textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
