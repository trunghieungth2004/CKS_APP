import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, Chip, ActivityIndicator, Surface, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { formatDate } from '../../utils/validators';

const STATUS_TABS = [
  { value: 'OR101', label: 'Production' },
  { value: 'OR102', label: 'Staged' },
];

const STATUS_COLORS = {
  OR101: '#5856D6',
  OR102: '#007AFF',
};

const STATUS_NAMES = {
  OR101: 'IN PRODUCTION',
  OR102: 'STAGED',
};

export default function CKOrdersScreen({ onNavigate, initialStatus, onStatusChange }) {
  const { paperTheme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState(initialStatus || 'OR101');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    // Use the all-orders endpoint or my-orders - adjust based on your API
    const result = await apiService.post('/api/order/my-orders', {
      order_status_id: selectedStatus
    });

    if (result.success && result.data.data) {
      const ordersData = result.data.data;
      
      // Load product information for all items
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
      onNavigate('CKOrderDetail', { orderId });
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
                      {order.store_id || 'N/A'}
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
              </Surface>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
});
