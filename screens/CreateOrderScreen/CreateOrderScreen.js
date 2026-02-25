import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { Button, Input, Card } from '../../components';
import apiService from '../../services/apiService';

export default function CreateOrderScreen({ onBack }) {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState([]);

  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border || !theme.colors.text) {
    return null;
  }

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.colors.statusBar} />
      
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border.light,
      }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Create New Order
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Cutoff: 6:00 PM Daily
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
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
              <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
                Loading products...
              </Text>
            ) : (
              orderItems.map(item => (
                <View key={item.product_id} style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, { color: theme.colors.text.primary }]}>
                      {item.product_name}
                    </Text>
                    <Text style={[styles.productPrice, { color: theme.colors.text.secondary }]}>
                      ₱{item.unit_price}
                    </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 17,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
  },
  quantityInput: {
    width: 120,
    marginBottom: 0,
  },
  actions: {
    marginTop: 20,
  },
});
