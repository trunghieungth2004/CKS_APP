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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  orderId: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.light,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs + 2,
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
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
});
