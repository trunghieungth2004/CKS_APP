import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, Chip, ActivityIndicator, Surface, Divider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog } from '../../components';
import apiService from '../../services/apiService';
import { formatDate } from '../../utils/validators';
import { API_ENDPOINTS } from '../../config/constants';

const STATUS_TABS = [
  { value: 'OR102', label: 'Staged' },
  { value: 'OR103', label: 'Dispatched' },
];

const STATUS_COLORS = {
  OR102: '#007AFF',
  OR103: '#34C759',
};

const STATUS_NAMES = {
  OR102: 'STAGED',
  OR103: 'DISPATCHED',
};

export default function SupplyStaffOrdersScreen({ onNavigate, initialStatus, onStatusChange }) {
  const { paperTheme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'OR102');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [dispatching, setDispatching] = useState(null);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false, orderId: null });

  useEffect(() => {
    setOrders([]);
    setLoading(true);
    loadOrders();
  }, [selectedStatus]);

  useEffect(() => {
    if (initialStatus && initialStatus !== selectedStatus) {
      setSelectedStatus(initialStatus);
      if (onStatusChange) {
        onStatusChange();
      }
    }
  }, [initialStatus]);

  const loadOrders = async () => {
    const result = await apiService.post(API_ENDPOINTS.ORDER.ALL, {
      order_status_id: selectedStatus
    });

    if (result.success && result.data.data) {
      const ordersData = result.data.data;
      
      const allProductIds = new Set();
      ordersData.forEach(order => {
        order.items?.forEach(item => allProductIds.add(item.product_id));
      });
      
      const productMap = {};
      for (const productId of allProductIds) {
        const result = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, { productId: productId });
        if (result.success && result.data.data) {
          productMap[productId] = result.data.data;
        }
      }
      setProducts(productMap);
      setOrders(ordersData);
    } else {
      setOrders([]);
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const calculateOrderTotal = (order) => {
    if (!order.items || order.items.length === 0) return 0;
    
    return order.items.reduce((total, item) => {
      const product = products[item.product_id];
      if (product && product.price) {
        return total + (Number(product.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleOrderPress = (orderId) => {
    if (onNavigate) {
      onNavigate('SupplyOrderDetail', { orderId });
    }
  };

  const handleDispatchOrder = async (orderId) => {
    setDispatching(orderId);
    
    const batchesResult = await apiService.post(API_ENDPOINTS.COOKED_BATCH.ALL, {
      order_id: orderId
    });
    
    if (!batchesResult.success || !batchesResult.data.data) {
      setDispatching(null);
      setDialog({
        visible: true,
        title: 'Error',
        message: 'Failed to load order batches',
        type: 'error',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false,
      });
      return;
    }
    
    const batches = batchesResult.data.data;
    const hasPendingBatches = batches.some(batch => batch.qc_status === 'PENDING');
    
    if (hasPendingBatches) {
      setDispatching(null);
      setDialog({
        visible: true,
        title: 'Cannot Dispatch',
        message: 'All batches must complete QC before dispatching. Some batches are still pending QC.',
        type: 'error',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false,
      });
      return;
    }

    const hasFailedBatches = batches.some(batch => batch.qc_status === 'FAIL');
    
    if (hasFailedBatches) {
      const failedCount = batches.filter(batch => batch.qc_status === 'FAIL').length;
      setDialog({
        visible: true,
        title: 'Warning: Failed Batches',
        message: `This order has ${failedCount} failed batch${failedCount > 1 ? 'es' : ''}. The order is incomplete. Are you sure you want to dispatch this order?`,
        type: 'warning',
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          dispatchOrderConfirmed(orderId);
        },
        showCancel: true,
        confirmText: 'Yes, Dispatch',
        cancelText: 'Cancel',
      });
      return;
    }
    
    dispatchOrderConfirmed(orderId);
  };

  const dispatchOrderConfirmed = async (orderId) => {
    const response = await apiService.post(API_ENDPOINTS.ORDER.UPDATE_STATUS, {
      order_id: orderId,
      order_status_id: 'OR103'
    });
    
    setDispatching(null);
    
    if (response.success) {
      setDialog({
        visible: true,
        title: 'Success',
        message: 'Order dispatched successfully',
        type: 'success',
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          loadOrders();
        },
        showCancel: false,
      });
    } else {
      setDialog({
        visible: true,
        title: 'Error',
        message: response.message || 'Failed to dispatch order',
        type: 'error',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Orders" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={[styles.tabContainer, { borderBottomColor: paperTheme.colors.outlineVariant }]}>
        {STATUS_TABS.map((tab) => (
          <Chip
            key={tab.value}
            mode={selectedStatus === tab.value ? 'flat' : 'outlined'}
            selected={selectedStatus === tab.value}
            onPress={() => setSelectedStatus(tab.value)}
            disabled={loading}
            style={[
              styles.tabChip,
              selectedStatus === tab.value && { backgroundColor: paperTheme.colors.primaryContainer }
            ]}
            textStyle={selectedStatus === tab.value && { color: paperTheme.colors.onPrimaryContainer }}
          >
            {tab.label}
          </Chip>
        ))}
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[paperTheme.colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              No {(STATUS_NAMES[selectedStatus] || 'orders').toLowerCase()}
            </Text>
          </View>
        ) : (
          orders.map(order => (
            <TouchableOpacity 
              key={order.order_id} 
              onPress={() => handleOrderPress(order.order_id)}
              activeOpacity={0.7}
            >
              <Surface style={styles.orderCard} elevation={1}>
                <View style={styles.orderHeader}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {order.order_id}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                      Created: {formatDate(order.created_at)}
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    compact
                    style={{ backgroundColor: STATUS_COLORS[order.order_status_id] }}
                    textStyle={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600' }}
                  >
                    {STATUS_NAMES[order.order_status_id]}
                  </Chip>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Store
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {order.store_staff_id || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Items
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {order.items?.length || 0}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Delivery Date
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {formatDate(order.delivery_date)}
                    </Text>
                  </View>

                  <View style={[styles.detailRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: paperTheme.colors.outlineVariant }]}>
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                      Total
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                      ${calculateOrderTotal(order).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {selectedStatus === 'OR102' && (
                  <Button
                    mode="contained"
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDispatchOrder(order.order_id);
                    }}
                    disabled={dispatching === order.order_id}
                    loading={dispatching === order.order_id}
                    style={{ marginTop: 16 }}
                    icon="truck-delivery"
                  >
                    Dispatch Order
                  </Button>
                )}
              </Surface>
            </TouchableOpacity>
          ))
        )}
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

      {(updating || dialog.visible || dispatching) && (
        <View style={styles.backdrop} pointerEvents="auto" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  tabChip: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 16,
  },
  orderCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageButton: {
    marginTop: 12,
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
