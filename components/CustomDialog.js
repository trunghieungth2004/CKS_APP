import React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

export default function CustomDialog({ 
  visible, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'error', 'warning', 'confirm'
  onDismiss,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
}) {
  const { paperTheme } = useTheme();

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          titleColor: paperTheme.colors.primary,
          icon: 'check-circle',
        };
      case 'error':
        return {
          titleColor: paperTheme.colors.error,
          icon: 'alert-circle',
        };
      case 'warning':
        return {
          titleColor: paperTheme.colors.tertiary,
          icon: 'alert',
        };
      case 'confirm':
        return {
          titleColor: paperTheme.colors.primary,
          icon: 'help-circle',
        };
      default:
        return {
          titleColor: paperTheme.colors.primary,
          icon: 'information',
        };
    }
  };

  const colors = getColors();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={[styles.title, { color: colors.titleColor }]}>
          {title}
        </Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurface }}>
            {message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          {showCancel && (
            <Button onPress={onDismiss} textColor={paperTheme.colors.onSurfaceVariant}>
              {cancelText}
            </Button>
          )}
          <Button 
            onPress={onConfirm || onDismiss}
            mode={type === 'error' || type === 'confirm' ? 'contained' : 'text'}
            buttonColor={type === 'error' ? paperTheme.colors.error : undefined}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 28,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});
