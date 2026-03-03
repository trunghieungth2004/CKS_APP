import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog } from '../../components';
import apiService from '../../services/apiService';
import { formatDate, formatDateTime } from '../../utils/validators';

const STATUS_COLORS = {
  OR100: '#FF9500',
  OR101: '#5856D6',
  OR102: '#007AFF',
  OR103: '#34C759',
  OR104: '#00C7BE',
  OR105: '#FF3B30',
};

const STATUS_NAMES = {
  OR100: 'PENDING',
  OR101: 'IN PRODUCTION',
  OR102: 'STAGED',
  OR103: 'DISPATCHED',
  OR104: 'DELIVERED',
  OR105: 'CANCELLED',
};

export default function CKOrderDetailScreen({ orderId, onBack, onNavigateTab }) {
  const { paperTheme } = useTheme();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false });

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    const result = await apiService.post('/api/order/one', { order_id: orderId });

    if (result.success && result.data.data) {
      const orderData = result.data.data;
      setOrder(orderData);
      
      const productIds = orderData.items.map(item => item.product_id);
      await loadProductDetails(productIds);
    } else {
      setDialog({ 
        visible: true, 
        title: 'Error', 
        message: 'Failed to load order details', 
        type: 'error', 
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          onBack();
        }, 
        showCancel: false 
      });
    }
    
    setLoading(false);
  };

  const loadProductDetails = async (productIds) => {
    const productMap = {};
    for (const productId of productIds) {
      const result = await apiService.post('/api/product/one', { productId: productId });
      if (result.success && result.data.data) {
        productMap[productId] = result.data.data;
      }
    }
    setProducts(productMap);
  };

  const handleUpdateToStaged = () => {
    setDialog({
      visible: true,
      title: 'Update to Staged',
      message: 'Mark this order as staged and ready for dispatch?',
      type: 'confirm',
      onConfirm: confirmUpdateToStaged,
      showCancel: true,
      confirmText: 'Confirm',
    });
  };

  const confirmUpdateToStaged = async () => {
    setDialog({ ...dialog, visible: false });
    setUpdating(true);
    
    const result = await apiService.post('/api/order/update-status', { 
      order_id: orderId,
      order_status_id: "OR102"
    });
    
    setUpdating(false);
    
    if (result.success) {
      setDialog({
        visible: true,
        title: 'Status Updated',
        message: 'Order has been moved to staged.',
        type: 'success',
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          if (onNavigateTab) {
            onNavigateTab('OR102'); // Navigate to staged orders
          } else {
            onBack();
          }
        },
        showCancel: false,
      });
    } else {
      setDialog({ 
        visible: true, 
        title: 'Error', 
        message: result.message || 'Failed to update order status', 
        type: 'error', 
        onConfirm: () => setDialog({ ...dialog, visible: false }), 
        showCancel: false 
      });
    }
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
          <Text variant="bodyLarge" style={styles.loadingText}>Loading order...</Text>
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
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            Order not found
          </Text>
        </View>
      </View>
    );
  }

  const canUpdateToStaged = order.order_status_id === 'OR101';

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={order.order_id} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Status */}
        <Surface style={styles.card} elevation={1}>
          <View style={styles.statusHeader}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Order Status</Text>
            <Chip
              mode="flat"
              style={{ backgroundColor: STATUS_COLORS[order.order_status_id] }}
              textStyle={{ color: '#FFFFFF', fontWeight: '600' }}
            >
              {STATUS_NAMES[order.order_status_id]}
            </Chip>
          </View>
        </Surface>

        {/* Order Information */}
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Order Information</Text>
          <Divider style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Store</Text>
            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{order.store_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Created</Text>
            <Text variant="bodyMedium">{formatDateTime(order.created_at)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Delivery Date</Text>
            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{formatDate(order.delivery_date)}</Text>
          </View>
          {order.notes && (
            <>
              <Divider style={styles.divider} />
              <View>
                <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 4 }}>Notes</Text>
                <Text variant="bodyMedium">{order.notes}</Text>
              </View>
            </>
          )}
        </Surface>

        {/* Order Items */}
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Order Items</Text>
          <Divider style={styles.divider} />
          
          {order.items && order.items.map((item, index) => {
            const product = products[item.product_id];
            const subtotal = product ? (Number(product.price) * item.quantity) : 0;
            
            return (
              <View key={index}>
                {index > 0 && <Divider style={{ marginVertical: 12 }} />}
                <View style={styles.itemContainer}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                      {product ? product.product_name : item.product_id}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                      Quantity: {item.quantity}
                    </Text>
                    {product && (
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Price: ${Number(product.price).toFixed(2)} each
                      </Text>
                    )}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>Item Total</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      ${subtotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </Surface>

        {/* Order Summary */}
        {order.subtotal !== undefined && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Order Summary</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium">Subtotal</Text>
                <Text variant="bodyMedium">${(order.subtotal || 0).toFixed(2)}</Text>
              </View>
              
              {order.credits_applied > 0 && (
                <View style={styles.summaryRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.tertiary }}>Credits Applied</Text>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.tertiary }}>
                    -${(order.credits_applied || 0).toFixed(2)}
                  </Text>
                </View>
              )}
              
              <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: paperTheme.colors.outlineVariant, paddingTop: 8, marginTop: 4 }]}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Total</Text>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  ${(order.total_after_credits || order.subtotal || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </Surface>
        )}

        {/* Status History */}
        {order.history && order.history.length > 0 && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Status History</Text>
            <Divider style={styles.divider} />
            
            {order.history.map((history, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyDot}>
                  <View style={[styles.dot, { backgroundColor: STATUS_COLORS[history.to_status_id] }]} />
                  {index < order.history.length - 1 && <View style={[styles.line, { backgroundColor: paperTheme.colors.outlineVariant }]} />}
                </View>
                <View style={{ flex: 1, paddingBottom: 16 }}>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {STATUS_NAMES[history.to_status_id]}
                  </Text>
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                    {formatDateTime(history.changed_at)}
                  </Text>
                  {history.changed_by && (
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      by {history.changed_by}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Surface>
        )}

        {/* Action Button for OR101 */}
        {canUpdateToStaged && (
          <Button
            mode="contained"
            onPress={handleUpdateToStaged}
            loading={updating}
            disabled={updating}
            style={styles.actionButton}
            contentStyle={{ paddingVertical: 8 }}
          >
            Move to Staged (OR102)
          </Button>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <CustomDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onDismiss={() => setDialog({ ...dialog, visible: false })}
        onConfirm={dialog.onConfirm}
        showCancel={dialog.showCancel}
        confirmText={dialog.confirmText}
      />

      {dialog.visible && (
        <View style={styles.backdrop} pointerEvents="none" />
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
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryContainer: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  historyItem: {
    flexDirection: 'row',
    gap: 12,
  },
  historyDot: {
    alignItems: 'center',
    width: 20,
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
  actionButton: {
    marginTop: 8,
    marginBottom: 16,
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
