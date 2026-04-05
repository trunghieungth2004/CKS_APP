import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider, Button as PaperButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog } from '../../components';
import apiService from '../../services/apiService';
import { formatDate, formatDateTime } from '../../utils/validators';
import { DISPUTE_WINDOW_HOURS, API_ENDPOINTS } from '../../config/constants';
import DisputeModal from './DisputeModal';

const STATUS_COLORS = {
  OR100: '#FF9500',
  OR101: '#5856D6',
  OR102: '#007AFF',
  OR103: '#34C759',
  OR104: '#00C7BE',
  OR105: '#FF3B30',
};

export default function OrderDetailScreen({ orderId, onBack, onNavigateTab, onRefreshStoreInfo }) {
  const { paperTheme } = useTheme();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false });

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.ORDER.ONE, { order_id: orderId });

    if (result.success && result.data.data) {
      const orderData = result.data.data;
      setOrder(orderData);
      
      const productIds = orderData.items.map(item => item.product_id);
      await loadProductDetails(productIds);
    } else {
      setDialog({ visible: true, title: 'Error', message: 'Failed to load order details', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
    }
    
    setLoading(false);
  };

  const loadProductDetails = async (productIds) => {
    const productMap = {};
    for (const productId of productIds) {
      const result = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, { productId: productId });
      if (result.success && result.data.data) {
        productMap[productId] = result.data.data;
      }
    }
    setProducts(productMap);
  };

  const canCancelOrder = () => {
    if (!order || order.order_status_id !== 'OR100') {
      return false; // Only pending orders can be cancelled
    }

    const now = new Date();
    const deliveryDate = new Date(order.delivery_date);
    
    const dayBeforeDelivery = new Date(deliveryDate);
    dayBeforeDelivery.setDate(dayBeforeDelivery.getDate() - 1);
    dayBeforeDelivery.setHours(18, 0, 0, 0);
    
    return now < dayBeforeDelivery;
  };

  const handleCancelOrder = () => {
    setDialog({
      visible: true,
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order? This action cannot be undone.',
      type: 'confirm',
      onConfirm: confirmCancelOrder,
      showCancel: true,
      confirmText: 'Yes, Cancel',
    });
  };

  const confirmCancelOrder = async () => {
    setDialog({ ...dialog, visible: false });
    setCancelling(true);
    
    const result = await apiService.post(API_ENDPOINTS.ORDER.UPDATE_STATUS, { 
      order_id: orderId,
      order_status_id: "OR105"
    });
    
    setCancelling(false);
    
    if (result.success) {      if (onRefreshStoreInfo) {
        await onRefreshStoreInfo();
      }      setDialog({
        visible: true,
        title: 'Order Cancelled',
        message: 'The order has been successfully cancelled.',
        type: 'success',
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          if (onNavigateTab) {
            onNavigateTab('orders', 'OR105'); // Navigate to cancelled orders
          } else {
            onBack();
          }
        },
        showCancel: false,
      });
    } else {
      setDialog({ visible: true, title: 'Error', message: result.message || 'Failed to cancel order', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
    }
  };

  const canFileDispute = () => {
    if (!order || order.order_status_id !== 'OR104') {
      return false;
    }

    const deliveryTime = new Date(order.updated_at || order.created_at);
    const now = new Date();
    const hoursSinceDelivery = (now - deliveryTime) / (1000 * 60 * 60);
    
    return hoursSinceDelivery <= DISPUTE_WINDOW_HOURS;
  };

  const handleFileDispute = () => {
    setDisputeModalVisible(true);
  };

  const handleDisputeSuccess = () => {
    loadOrderDetails();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <Text variant="bodyLarge">Order not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title="Order Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={1}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
              {order.order_id}
            </Text>
            <Chip
              mode="flat"
              style={{ backgroundColor: STATUS_COLORS[order.order_status_id] }}
              textStyle={styles.statusText}
            >
              {order.status_name}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Order Information</Text>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Delivery Date
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {formatDate(order.delivery_date)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Created
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {formatDateTime(order.created_at)}
              </Text>
            </View>

            {order.notes && (
              <View style={styles.notesContainer}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 4 }}>
                  Notes
                </Text>
                <Text variant="bodyMedium">{order.notes}</Text>
              </View>
            )}
          </View>

          {canCancelOrder() && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <PaperButton
                  mode="contained"
                  onPress={handleCancelOrder}
                  loading={cancelling}
                  disabled={cancelling}
                  buttonColor={paperTheme.colors.error}
                  textColor={paperTheme.colors.onError}
                  icon="cancel"
                  style={styles.cancelButton}
                >
                  Cancel Order
                </PaperButton>
                <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                  Orders can be cancelled before 6PM the day before delivery
                </Text>
              </View>
            </>
          )}

          {canFileDispute() && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <PaperButton
                  mode="contained-tonal"
                  onPress={handleFileDispute}
                  buttonColor={paperTheme.colors.errorContainer}
                  textColor={paperTheme.colors.onErrorContainer}
                  icon="alert-circle"
                  style={styles.disputeButton}
                  labelStyle={{ fontWeight: '700' }}
                >
                  FILE DISPUTE
                </PaperButton>
                <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                  Disputes must be filed within 1 hour of delivery
                </Text>
              </View>
            </>
          )}

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Items ({order.items.length})</Text>
            {order.items.map((item, index) => {
              const product = products[item.product_id];
              return (
                <Surface key={index} style={[styles.itemCard, { borderColor: paperTheme.colors.outlineVariant }]} elevation={0}>
                  <View style={styles.itemContent}>
                    <View style={styles.itemInfo}>
                      <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                        {product?.product_name || 'Loading...'}
                      </Text>
                      {product?.product_description && (
                        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                          {product.product_description}
                        </Text>
                      )}
                      {product?.price && (
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600', marginTop: 4 }}>
                          ${Number(product.price).toFixed(2)} each
                        </Text>
                      )}
                    </View>
                    <View style={styles.quantityBadge}>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Quantity
                      </Text>
                      <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                        {item.quantity}
                      </Text>
                    </View>
                  </View>
                  {product?.price && (
                    <View style={[styles.itemTotal, { borderTopColor: paperTheme.colors.outlineVariant }]}>
                      <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Item Total
                      </Text>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                        ${(Number(product.price) * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </Surface>
              );
            })}
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Subtotal
              </Text>
              <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                ${(order.subtotal || 0).toFixed(2)}
              </Text>
            </View>
            {order.credits_applied > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.tertiary }}>
                  Credits Applied
                </Text>
                <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: paperTheme.colors.tertiary }}>
                  -${(order.credits_applied || 0).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, { paddingTop: 8, borderTopWidth: 1, borderTopColor: paperTheme.colors.outlineVariant }]}>
              <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                Total
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                ${(order.total_after_credits !== undefined ? order.total_after_credits : order.subtotal || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </Surface>

        {order.history && order.history.length > 0 && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Order History</Text>
            
            {order.history.map((entry, index) => (
              <View key={entry.history_id} style={styles.historyEntry}>
                <View style={styles.historyDot}>
                  <View style={[styles.dot, { backgroundColor: STATUS_COLORS[entry.to_status_id] || paperTheme.colors.primary }]} />
                  {index < order.history.length - 1 && (
                    <View style={[styles.line, { backgroundColor: paperTheme.colors.outlineVariant }]} />
                  )}
                </View>
                
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    {entry.from_status_name ? (
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {entry.from_status_name} → {entry.to_status_name}
                      </Text>
                    ) : (
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {entry.to_status_name}
                      </Text>
                    )}
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      {formatDateTime(entry.created_at)}
                    </Text>
                  </View>
                  
                  {entry.notes && (
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                      {entry.notes}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Surface>
        )}
      </ScrollView>

      <DisputeModal
        visible={disputeModalVisible}
        order={order}
        products={products}
        onClose={() => setDisputeModalVisible(false)}
        onSuccess={handleDisputeSuccess}
      />

      <CustomDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onDismiss={() => setDialog({ ...dialog, visible: false })}
        onConfirm={dialog.onConfirm}
        showCancel={dialog.showCancel}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
      />

      {(cancelling || dialog.visible || disputeModalVisible) && (
        <View style={styles.backdrop} pointerEvents="auto" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notesContainer: {
    marginTop: 8,
  },
  cancelButton: {
    marginVertical: 8,
  },
  disputeButton: {
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  itemCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
  },
  historyEntry: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyDot: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'column',
    gap: 4,
  },
  summaryContainer: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
});
