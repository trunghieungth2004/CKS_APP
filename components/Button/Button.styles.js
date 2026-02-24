import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../styles/theme';

export default StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    padding: spacing.md + 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm + 2,
    ...shadows.medium,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.text.light,
  },
  secondaryText: {
    color: colors.text.light,
  },
  successText: {
    color: colors.text.light,
  },
  dangerText: {
    color: colors.text.light,
  },
  outlineText: {
    color: colors.primary,
  },
});
