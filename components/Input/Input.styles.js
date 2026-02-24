import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../styles/theme';

export default StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: colors.text.tertiary,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginTop: spacing.xs + 2,
  },
});
