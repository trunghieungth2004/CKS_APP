import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../../styles/theme';

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
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.warning,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  productPrice: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  quantityInput: {
    width: 100,
    marginBottom: 0,
  },
  actions: {
    marginTop: spacing.lg,
  },
});
