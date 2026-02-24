import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../styles/theme';

export default StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md + 2,
    marginBottom: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  default: {
    backgroundColor: colors.surface,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  iconContainer: {
    marginRight: spacing.sm + 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  primaryText: {
    color: colors.text.light,
  },
  successText: {
    color: colors.text.light,
  },
  warningText: {
    color: colors.text.light,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  arrow: {
    fontSize: fontSize.xl,
    color: colors.text.tertiary,
    fontWeight: '300',
  },
});
