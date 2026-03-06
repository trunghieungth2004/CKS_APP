import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Card } from '../../components';
import apiService from '../../services/apiService';
import { formatDate } from '../../utils/validators';
import { API_ENDPOINTS } from '../../config/constants';
import styles from './ConfirmDeliveryScreen.styles';

export default function ConfirmDeliveryScreen({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    loadDispatchedOrders();
  }, []);

  const loadDispatchedOrders = async () => {
    const result = await apiService.post(API_ENDPOINTS.ORDER.MY_ORDERS, {});
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data) {
      const dispatched = result.data.data.filter(order => order.order_status_id === 'OR103');
      setOrders(dispatched);
    } else {
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDispatchedOrders();
  };

  const handleConfirm = (orderId) => {
    Alert.alert(
      'Confirm Delivery',
      'Have you received this delivery? Items will be added to your inventory.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => confirmDelivery(orderId),
        },
      ]
    );
  };

  const confirmDelivery = async (orderId) => {
    setConfirming(orderId);

    const result = await apiService.post(API_ENDPOINTS.ORDER.UPDATE_STATUS, {
      order_id: orderId,
      new_status_id: 'OR104',
      notes: 'Delivery confirmed by store staff',
    });

    setConfirming(null);

    if (result.success) {
      Alert.alert('Success', 'Delivery confirmed! Items added to inventory.');
      loadDispatchedOrders();
    } else {
      Alert.alert('Error', result.message || 'Failed to confirm delivery');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Delivery</Text>
        <Text style={styles.subtitle}>Dispatched Orders (OR103)</Text>
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
          <Text style={styles.emptyText}>No dispatched orders</Text>
        ) : (
          orders.map(order => (
            <Card key={order.order_id}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.order_id}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>DISPATCHED</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivery Date:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(order.delivery_date)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Items:</Text>
                <Text style={styles.infoValue}>{order.items?.length || 0}</Text>
              </View>

              <View style={styles.actions}>
                <Button
                  title="Confirm Delivery"
                  onPress={() => handleConfirm(order.order_id)}
                  loading={confirming === order.order_id}
                  variant="success"
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={onBack} variant="outline" />
      </View>
    </View>
  );
}
