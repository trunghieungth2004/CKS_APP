import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { Button, Card } from '../../components';
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
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border || !theme.colors.text) {
    return null;
  }

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
          My Orders
        </Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {loading ? (
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
            Loading orders...
          </Text>
        ) : orders.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No orders found
          </Text>
        ) : (
          orders.map(order => (
            <TouchableOpacity
              key={order.order_id}
              onPress={() => onNavigate('OrderDetail', { orderId: order.order_id })}
              activeOpacity={0.7}
            >
              <Card>
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderId, { color: theme.colors.text.primary }]}>
                    {order.order_id}
                  </Text>
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
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                    Delivery Date:
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.orderInfo}>
                  <Text style={[styles.infoLabel, { color: theme.colors.text.secondary }]}>
                    Items:
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text.primary }]}>
                    {order.items?.length || 0}
                  </Text>
                </View>
              </Card>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 100,
  },
});
