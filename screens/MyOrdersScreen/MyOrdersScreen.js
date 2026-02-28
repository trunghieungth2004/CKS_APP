import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Alert, StyleSheet } from 'react-native';
import { Text, Appbar, Chip, ActivityIndicator, Surface } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components';
import apiService from '../../services/apiService';

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

export default function MyOrdersScreen({ onBack, onNavigate }) {
  const { theme, paperTheme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const result = await apiService.post('/api/order/my-orders', {});
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data) {
      setOrders(result.data.data);
    } else {
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style={theme.colors.statusBar} />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title="My Orders" />
      </Appbar.Header>
      
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
              No orders found
            </Text>
          </View>
        ) : (
          orders.map(order => (
            <Card
              key={order.order_id}
              onPress={() => onNavigate('OrderDetail', { orderId: order.order_id })}
              elevation={2}
            >
              <View style={styles.orderHeader}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {order.order_id}
                </Text>
                <Chip
                  mode="flat"
                  style={{ backgroundColor: STATUS_COLORS[order.order_status_id] }}
                  textStyle={styles.statusText}
                >
                  {STATUS_NAMES[order.order_status_id]}
                </Chip>
              </View>

              <View style={styles.orderInfo}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  Delivery Date:
                </Text>
                <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
                  {new Date(order.delivery_date).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.orderInfo}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  Items:
                </Text>
                <Text variant="bodyMedium" style={{ fontWeight: '500' }}>
                  {order.items?.length || 0}
                </Text>
              </View>
            </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
