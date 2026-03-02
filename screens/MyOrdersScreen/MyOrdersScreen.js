import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, Chip, ActivityIndicator, Surface, SegmentedButtons, IconButton, Button as PaperButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog } from '../../components';
import apiService from '../../services/apiService';
import { formatDate } from '../../utils/validators';
import { DISPUTE_WINDOW_HOURS } from '../../config/constants';
import DisputeModal from '../OrderDetailScreen/DisputeModal';

const STATUS_TABS = [
  { value: 'OR100', label: 'Pending' },
  { value: 'OR101', label: 'Production' },
  { value: 'OR102', label: 'Staged' },
  { value: 'OR103', label: 'Dispatched' },
  { value: 'OR104', label: 'Delivered' },
  { value: 'OR105', label: 'Cancelled' },
];

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

export default function MyOrdersScreen({ onNavigate, initialStatus, onStatusChange }) {
  const { paperTheme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'OR100');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [disputeOrder, setDisputeOrder] = useState(null);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false });

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
    const result = await apiService.post('/api/order/my-orders', {
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
        const result = await apiService.post('/api/product/one', { productId });
        if (result.success && result.data.data) {
          productMap[productId] = result.data.data;
        }
      }
      setProducts(productMap);
      setOrders(ordersData);
    } else {
      setOrders([]);
      setDialog({ visible: true, title: 'Error', message: 'Failed to load orders', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleOrderPress = (orderId) => {
    onNavigate('OrderDetail', { orderId });
  };

  const canCancelOrder = (order) => {
    if (!order || order.order_status_id !== 'OR100') {
      return false;
    }

    const now = new Date();
    const deliveryDate = new Date(order.delivery_date);
    
    const dayBeforeDelivery = new Date(deliveryDate);
    dayBeforeDelivery.setDate(dayBeforeDelivery.getDate() - 1);
    dayBeforeDelivery.setHours(18, 0, 0, 0);
    
    return now < dayBeforeDelivery;
  };

  const canFileDispute = (order) => {
    if (!order || order.order_status_id !== 'OR104') {
      return false;
    }

    if (!order.history || order.history.length === 0) return false;
    
    const deliveryHistory = order.history.find(h => h.to_status_id === 'OR104');
    if (!deliveryHistory) return false;

    const deliveryTime = new Date(deliveryHistory.changed_at);
    const now = new Date();
    const hoursSinceDelivery = (now - deliveryTime) / (1000 * 60 * 60);
    
    return hoursSinceDelivery <= DISPUTE_WINDOW_HOURS;
  };

  const handleCancelOrder = (order) => {
    setDialog({
      visible: true,
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order? This action cannot be undone.',
      type: 'confirm',
      onConfirm: () => confirmCancelOrder(order.order_id),
      showCancel: true,
      confirmText: 'Yes, Cancel',
    });
  };

  const confirmCancelOrder = async (orderId) => {
    setDialog({ ...dialog, visible: false });
    setCancellingOrderId(orderId);
    
    const result = await apiService.post('/api/order/update-status', { 
      order_id: orderId,
      order_status_id: "OR105"
    });
    
    setCancellingOrderId(null);
    
    if (result.success) {
      setDialog({
        visible: true,
        title: 'Order Cancelled',
        message: 'The order has been successfully cancelled.',
        type: 'success',
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          setSelectedStatus('OR105'); // Navigate to cancelled orders
        },
        showCancel: false,
      });
    } else {
      setDialog({ visible: true, title: 'Error', message: result.message || 'Failed to cancel order', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
    }
  };

  const handleFileDispute = (order, e) => {
    if (e) e.stopPropagation();
    setDisputeOrder(order);
  };

  const handleDisputeSuccess = () => {
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

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="My Orders" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={[styles.tabContainer, { borderBottomColor: paperTheme.colors.outlineVariant }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {STATUS_TABS.map((tab) => (
            <Chip
              key={tab.value}
              mode={selectedStatus === tab.value ? 'flat' : 'outlined'}
              selected={selectedStatus === tab.value}
              onPress={() => setSelectedStatus(tab.value)}
              style={[
                styles.tabChip,
                selectedStatus === tab.value && { backgroundColor: paperTheme.colors.primaryContainer }
              ]}
              textStyle={selectedStatus === tab.value && { color: paperTheme.colors.onPrimaryContainer }}
            >
              {tab.label}
            </Chip>
          ))}
        </ScrollView>
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
              No {STATUS_NAMES[selectedStatus].toLowerCase()} orders
            </Text>
          </View>
        ) : (
          orders.map(order => (
            <TouchableOpacity 
              key={order.order_id}
              onPress={() => handleOrderPress(order.order_id)}
              activeOpacity={0.7}
            >
              <Surface
                style={styles.orderCard}
                elevation={1}
              >
                <View style={styles.orderHeader}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {order.order_id}
                  </Text>
                  <Chip
                    mode="flat"
                    compact
                    style={{ backgroundColor: STATUS_COLORS[order.order_status_id] }}
                    textStyle={styles.statusText}
                  >
                    {STATUS_NAMES[order.order_status_id]}
                  </Chip>
                </View>

                <View style={styles.orderInfo}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Delivery: {formatDate(order.delivery_date)}
                  </Text>
                </View>

                <View style={styles.orderInfoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Items: {order.items?.length || 0}
                  </Text>
                  <Text variant="bodyLarge" style={{ color: paperTheme.colors.primary, fontWeight: 'bold' }}>
                    ${calculateOrderTotal(order).toFixed(2)}
                  </Text>
                </View>

                {(canCancelOrder(order) || canFileDispute(order)) && (
                  <View style={styles.orderActions}>
                    {canFileDispute(order) ? (
                      <IconButton
                        icon="alert-circle"
                        size={24}
                        mode="contained"
                        containerColor={paperTheme.colors.error}
                        iconColor={paperTheme.colors.onError}
                        onPress={(e) => handleFileDispute(order, e)}
                        style={styles.actionIcon}
                      />
                    ) : (
                      <PaperButton
                        mode="outlined"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order);
                        }}
                        loading={cancellingOrderId === order.order_id}
                        disabled={cancellingOrderId === order.order_id}
                        textColor={paperTheme.colors.error}
                        style={[styles.actionButton, { borderColor: paperTheme.colors.error }]}
                        labelStyle={{ fontSize: 13, fontWeight: '600' }}
                      >
                        CANCEL
                      </PaperButton>
                    )}
                  </View>
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
        cancelText={dialog.cancelText}
      />

      {disputeOrder && (
        <DisputeModal
          visible={true}
          order={disputeOrder}
          products={products}
          onClose={() => setDisputeOrder(null)}
          onSuccess={() => {
            setDisputeOrder(null);
            handleDisputeSuccess();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    borderBottomWidth: 1,
  },
  tabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabChip: {
    marginRight: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 40,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  orderInfo: {
    marginBottom: 8,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: {
    minHeight: 40,
    paddingHorizontal: 16,
  },
  actionIcon: {
    margin: 0,
  },
});
