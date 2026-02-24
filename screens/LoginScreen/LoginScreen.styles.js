import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../styles/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  testInfo: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  testInfoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  testInfoText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
});
