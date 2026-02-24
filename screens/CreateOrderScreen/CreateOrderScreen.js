import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input, Card } from '../../components';
import apiService from '../../services/apiService';
import styles from './CreateOrderScreen.styles';

export default function CreateOrderScreen({ onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await apiService.get('/api/product/all');
    setLoading(false);

    if (result.success && result.data.data) {
      setProducts(result.data.data);
      setOrderItems(
        result.data.data.map(p => ({
          product_id: p.product_id,
          product_name: p.product_name,
          unit_price: p.unit_price,
          quantity: '',
        }))
      );
    } else {
      Alert.alert('Error', 'Failed to load products');
    }
  };

  const updateQuantity = (productId, quantity) => {
    setOrderItems(prev =>
      prev.map(item =>
        item.product_id === productId
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const handleSubmit = async () => {
    const items = orderItems.filter(item => item.quantity && parseFloat(item.quantity) > 0);

    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one item');
      return;
    }

    if (!deliveryDate) {
      Alert.alert('Validation Error', 'Please enter delivery date');
      return;
    }

    setSubmitting(true);

    const result = await apiService.post('/api/order/create', {
      delivery_date: deliveryDate,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: parseFloat(item.quantity),
      })),
      notes: notes || undefined,
    });

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Success', 'Order created successfully', [
        { text: 'OK', onPress: onBack },
      ]);
    } else {
      Alert.alert('Error', result.message || 'Failed to create order');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Order</Text>
            <Text style={styles.subtitle}>Cutoff: 6:00 PM Daily</Text>
          </View>

          <Card title="Order Details">
            <Input
              label="Delivery Date"
              placeholder="YYYY-MM-DD"
              value={deliveryDate}
              onChangeText={setDeliveryDate}
            />
            <Input
              label="Notes (Optional)"
              placeholder="Special instructions..."
              value={notes}
              onChangeText={setNotes}
            />
          </Card>

          <Card title="Order Items">
            {loading ? (
              <Text style={styles.loadingText}>Loading products...</Text>
            ) : (
              orderItems.map(item => (
                <View key={item.product_id} style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.product_name}</Text>
                    <Text style={styles.productPrice}>₱{item.unit_price}</Text>
                  </View>
                  <Input
                    placeholder="Qty (kg)"
                    value={item.quantity}
                    onChangeText={(val) => updateQuantity(item.product_id, val)}
                    keyboardType="decimal-pad"
                    style={styles.quantityInput}
                  />
                </View>
              ))
            )}
          </Card>

          <View style={styles.actions}>
            <Button
              title="Create Order"
              onPress={handleSubmit}
              loading={submitting}
              variant="primary"
            />
            <Button title="Cancel" onPress={onBack} variant="outline" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
