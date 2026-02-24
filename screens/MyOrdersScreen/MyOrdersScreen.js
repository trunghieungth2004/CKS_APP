import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Card } from '../../components';
import apiService from '../../services/apiService';
import styles from './MyOrdersScreen.styles';

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
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading orders...</Text>
        ) : orders.length === 0 ? (
          <Text style={styles.emptyText}>No orders found</Text>
        ) : (
          orders.map(order => (
            <TouchableOpacity
              key={order.order_id}
              onPress={() => onNavigate('OrderDetail', { orderId: order.order_id })}
            >
              <Card>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>{order.order_id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: STATUS_COLORS[order.order_status_id] },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {STATUS_NAMES[order.order_status_id]}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderInfo}>
                  <Text style={styles.infoLabel}>Delivery Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.orderInfo}>
                  <Text style={styles.infoLabel}>Items:</Text>
                  <Text style={styles.infoValue}>{order.items?.length || 0}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={onBack} variant="outline" />
      </View>
    </View>
  );
}
