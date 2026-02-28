import React from 'react';
import { StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

const MenuButton = ({ title, subtitle, onPress, icon, variant = 'default' }) => {
  const { paperTheme } = useTheme();

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return paperTheme.colors.primary;
      case 'success':
        return paperTheme.colors.tertiary;
      case 'warning':
        return paperTheme.colors.error;
      case 'danger':
        return paperTheme.colors.error;
      default:
        return paperTheme.colors.onSurface;
    }
  };

  return (
    <List.Item
      title={title}
      description={subtitle}
      onPress={onPress}
      left={icon ? () => icon : undefined}
      right={props => <List.Icon {...props} icon="chevron-right" />}
      style={styles.item}
      titleStyle={[styles.title, { color: getVariantColor() }]}
      descriptionStyle={styles.description}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default MenuButton;
