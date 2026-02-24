import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../styles/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  warning: {
    fontSize: fontSize.sm,
    color: colors.danger,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  orderId: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
  itemRow: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  itemName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemQty: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  issueTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  issueTypeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: 0,
  },
  issueTypeText: {
    fontSize: fontSize.xs,
  },
  actions: {
    marginTop: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
});
