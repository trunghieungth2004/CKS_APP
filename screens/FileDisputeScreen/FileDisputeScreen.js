import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Input } from '../../components';
import apiService from '../../services/apiService';
import styles from './FileDisputeScreen.styles';

export default function FileDisputeScreen({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reason, setReason] = useState('');
  const [disputeItems, setDisputeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDeliveredOrders();
  }, []);

  const loadDeliveredOrders = async () => {
    const result = await apiService.post('/api/order/my-orders', {});
    setLoading(false);

    if (result.success && result.data.data) {
      const delivered = result.data.data.filter(order => order.order_status_id === 'OR104');
      setOrders(delivered);
    }
  };

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setDisputeItems(
      order.items.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        ordered_quantity: item.quantity,
        disputed_quantity: '',
        issue_type: 'MISSING',
      }))
    );
  };

  const updateDisputeItem = (productId, field, value) => {
    setDisputeItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Validation Error', 'Please provide a reason for the dispute');
      return;
    }

    const items = disputeItems.filter(item => item.disputed_quantity && parseFloat(item.disputed_quantity) > 0);

    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one disputed item');
      return;
    }

    setSubmitting(true);

    const result = await apiService.post('/api/dispute', {
      order_id: selectedOrder.order_id,
      items: items.map(item => ({
        product_id: item.product_id,
        disputed_quantity: parseFloat(item.disputed_quantity),
        issue_type: item.issue_type,
      })),
      reason: reason,
    });

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Success', 'Dispute filed successfully', [
        { text: 'OK', onPress: onBack },
      ]);
    } else {
      Alert.alert('Error', result.message || 'Failed to file dispute');
    }
  };

  if (!selectedOrder) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.title}>File Dispute</Text>
          <Text style={styles.subtitle}>Select a delivered order</Text>
          <Text style={styles.warning}>Must file within 1 hour of delivery</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <Text style={styles.loadingText}>Loading orders...</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.emptyText}>No delivered orders found</Text>
          ) : (
            orders.map(order => (
              <Card key={order.order_id} onPress={() => selectOrder(order)}>
                <Text style={styles.orderId}>{order.order_id}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Delivered:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Items:</Text>
                  <Text style={styles.infoValue}>{order.items?.length || 0}</Text>
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

  const ISSUE_TYPES = ['MISSING', 'SPOILED', 'DAMAGED', 'WRONG_ITEM', 'QUANTITY_MISMATCH'];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>File Dispute</Text>
        <Text style={styles.subtitle}>{selectedOrder.order_id}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card title="Dispute Reason">
          <Input
            placeholder="Describe the issue..."
            value={reason}
            onChangeText={setReason}
            multiline
          />
        </Card>

        <Card title="Disputed Items">
          {disputeItems.map(item => (
            <View key={item.product_id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.product_name}</Text>
              <Text style={styles.itemQty}>Ordered: {item.ordered_quantity} kg</Text>
              
              <Input
                label="Disputed Quantity (kg)"
                placeholder="0.0"
                value={item.disputed_quantity}
                onChangeText={(val) => updateDisputeItem(item.product_id, 'disputed_quantity', val)}
                keyboardType="decimal-pad"
              />

              <View style={styles.issueTypeRow}>
                {ISSUE_TYPES.map(type => (
                  <Button
                    key={type}
                    title={type}
                    onPress={() => updateDisputeItem(item.product_id, 'issue_type', type)}
                    variant={item.issue_type === type ? 'primary' : 'outline'}
                    style={styles.issueTypeButton}
                    textStyle={styles.issueTypeText}
                  />
                ))}
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button
            title="Submit Dispute"
            onPress={handleSubmit}
            loading={submitting}
            variant="danger"
          />
          <Button
            title="Cancel"
            onPress={() => setSelectedOrder(null)}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}
