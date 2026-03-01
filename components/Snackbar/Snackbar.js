import React from 'react';
import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

export default function Snackbar({ visible, message, type = 'info', duration = 3000, onDismiss, action }) {
  const { paperTheme } = useTheme();

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return paperTheme.colors.successContainer || '#4CAF50';
      case 'error':
        return paperTheme.colors.errorContainer || '#F44336';
      case 'warning':
        return paperTheme.colors.warningContainer || '#FF9800';
      case 'info':
      default:
        return paperTheme.colors.primaryContainer;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return paperTheme.colors.onSuccessContainer || '#FFFFFF';
      case 'error':
        return paperTheme.colors.onErrorContainer || '#FFFFFF';
      case 'warning':
        return paperTheme.colors.onWarningContainer || '#000000';
      case 'info':
      default:
        return paperTheme.colors.onPrimaryContainer;
    }
  };

  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
      theme={{
        colors: {
          onSurface: getTextColor(),
          inverseOnSurface: getTextColor(),
        },
      }}
    >
      {message}
    </PaperSnackbar>
  );
}
