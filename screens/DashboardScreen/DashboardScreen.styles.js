import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../styles/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  actions: {
    marginTop: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.base,
    color: colors.danger,
    textAlign: 'center',
  },
});
