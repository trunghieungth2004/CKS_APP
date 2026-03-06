import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, Chip, ActivityIndicator, Surface } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog } from '../../components';
import apiService from '../../services/apiService';
import { formatDate } from '../../utils/validators';
import { API_ENDPOINTS } from '../../config/constants';

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

export default function ManagerOrdersScreen({ onNavigate, initialStatus, onStatusChange }) {
  const { paperTheme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'OR100');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null });

  useEffect(() => {
    setOrders([]);
    setLoading(true);
    loadOrders();
  }, [selectedStatus]);

  useEffect(() => {
    if (initialStatus && initialStatus !== selectedStatus) {
      setSelectedStatus(initialStatus);
    }
  }, [initialStatus]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(selectedStatus);
    }
  }, [selectedStatus]);

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
        const result = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, { productId });
        if (result.success && result.data.data) {
          productMap[productId] = result.data.data;
        }
      }
      setProducts(productMap);
      setOrders(ordersData);
    } else {
      setOrders([]);
      setDialog({ visible: true, title: 'Error', message: 'Failed to load orders', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }) });
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleOrderPress = (orderId) => {
    onNavigate('ManagerOrderDetail', { orderId });
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
        <Appbar.Content title="All Orders" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={[styles.tabContainer, { borderBottomColor: paperTheme.colors.outlineVariant }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
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
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {order.order_id}
                    </Text>
                    {order.store_name && (
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                        Store: {order.store_name}
                      </Text>
                    )}
                  </View>
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
      />
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
    padding: 16,
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  orderInfo: {
    marginBottom: 8,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});
