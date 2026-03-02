import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Button as PaperButton, Menu, Divider, IconButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { formatDate } from '../../utils/validators';
import { DISPUTE_TYPES, DISPUTE_TYPE_LABELS, DISPUTE_TYPE_DESCRIPTIONS, DISPUTE_WINDOW_HOURS } from '../../config/constants';

export default function FileDisputeScreen() {
  const { paperTheme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [disputeItems, setDisputeItems] = useState([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    loadDeliveredOrders();
  }, []);

  const loadDeliveredOrders = async () => {
    setLoading(true);
    const result = await apiService.post('/api/order/my-orders', {
      order_status_id: 'OR104'
    });
    setLoading(false);

    if (result.success && result.data.data) {
      const eligibleOrders = result.data.data.filter(order => isWithinDisputeWindow(order));
      setOrders(eligibleOrders);
    } else {
      Alert.alert('Error', 'Failed to load orders');
    }
  };

  const isWithinDisputeWindow = (order) => {
    if (!order.history || order.history.length === 0) return false;
    
    const deliveryHistory = order.history.find(h => h.to_status_id === 'OR104');
    if (!deliveryHistory) return false;

    const deliveryTime = new Date(deliveryHistory.changed_at);
    const now = new Date();
    const hoursSinceDelivery = (now - deliveryTime) / (1000 * 60 * 60);
    
    return hoursSinceDelivery <= DISPUTE_WINDOW_HOURS;
  };

  const getTimeRemaining = (order) => {
    if (!order.history || order.history.length === 0) return '';
    
    const deliveryHistory = order.history.find(h => h.to_status_id === 'OR104');
    if (!deliveryHistory) return '';

    const deliveryTime = new Date(deliveryHistory.changed_at);
    const now = new Date();
    const minutesRemaining = Math.floor((DISPUTE_WINDOW_HOURS * 60) - ((now - deliveryTime) / (1000 * 60)));
    
    if (minutesRemaining <= 0) return 'Expired';
    if (minutesRemaining < 60) return `${minutesRemaining}m remaining`;
    return `${Math.floor(minutesRemaining / 60)}h ${minutesRemaining % 60}m remaining`;
  };

  const selectOrder = async (order) => {
    setSelectedOrder(order);
    
    const productDetails = {};
    for (const item of order.items) {
      const result = await apiService.post('/api/product/one', { productId: item.product_id });
      if (result.success && result.data.data) {
        productDetails[item.product_id] = result.data.data;
      }
    }
    setProducts(productDetails);

    setDisputeItems(
      order.items.map(item => ({
        product_id: item.product_id,
        ordered_quantity: item.quantity,
        disputed_quantity: '',
        issue_type: DISPUTE_TYPES.MISSING,
        enabled: false,
      }))
    );
  };

  const toggleDisputeItem = (productId) => {
    setDisputeItems(prev =>
      prev.map(item =>
        item.product_id === productId 
          ? { ...item, enabled: !item.enabled, disputed_quantity: item.enabled ? '' : '1' }
          : item
      )
    );
  };

  const updateDisputeQuantity = (productId, value) => {
    setDisputeItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, disputed_quantity: value } : item
      )
    );
  };

  const updateIssueType = (productId, issueType) => {
    setDisputeItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, issue_type: issueType } : item
      )
    );
    setMenuVisible({ ...menuVisible, [productId]: false });
  };

  const handleSubmit = async () => {
    const items = disputeItems.filter(item => item.enabled && item.disputed_quantity && parseFloat(item.disputed_quantity) > 0);

    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one item to dispute');
      return;
    }

    for (const item of items) {
      const quantity = parseFloat(item.disputed_quantity);
      if (quantity > item.ordered_quantity) {
        Alert.alert('Validation Error', `Disputed quantity for a product cannot exceed ordered quantity (${item.ordered_quantity})`);
        return;
      }
      if (quantity <= 0) {
        Alert.alert('Validation Error', 'Disputed quantity must be greater than 0');
        return;
      }
    }

    if (!reason.trim()) {
      Alert.alert('Validation Error', 'Please provide a detailed reason for the dispute');
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
        {
          text: 'OK',
          onPress: () => {
            setSelectedOrder(null);
            setDisputeItems([]);
            setReason('');
            loadDeliveredOrders();
          },
        },
      ]);
    } else {
      Alert.alert('Error', result.message || 'Failed to file dispute');
    }
  };

  if (!selectedOrder) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <StatusBar style="auto" />
        
        <Appbar.Header elevated>
          <Appbar.Content title="File Dispute" titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>

        <View style={styles.infoCard}>
          <Surface style={[styles.warningCard, { backgroundColor: paperTheme.colors.errorContainer }]} elevation={0}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onErrorContainer, fontWeight: '600' }}>
              Disputes must be filed within 1 hour of delivery
            </Text>
          </Surface>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" />
              <Text variant="bodyLarge" style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.centerContent}>
              <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                No eligible orders for dispute
              </Text>
              <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                Orders must be delivered within the last hour
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <TouchableOpacity key={order.order_id} onPress={() => selectOrder(order)}>
                <Surface style={styles.orderCard} elevation={1}>
                  <View style={styles.orderHeader}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        {order.order_id}
                      </Text>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                        {order.items.length} items
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Chip
                        mode="flat"
                        compact
                        style={{ backgroundColor: paperTheme.colors.primaryContainer }}
                        textStyle={{ color: paperTheme.colors.onPrimaryContainer, fontSize: 11, fontWeight: '600' }}
                      >
                        DELIVERED
                      </Chip>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.error, marginTop: 4, fontWeight: '600' }}>
                        {getTimeRemaining(order)}
                      </Text>
                    </View>
                  </View>
                  
                  <Divider style={{ marginVertical: 12 }} />
                  
                  <View style={styles.orderInfo}>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Delivery Date: {formatDate(order.delivery_date)}
                    </Text>
                  </View>
                </Surface>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => setSelectedOrder(null)} />
        <Appbar.Content title="Dispute Items" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.orderSummary}>
        <Surface style={styles.summaryCard} elevation={0}>
          <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
            Order: {selectedOrder.order_id}
          </Text>
          <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
            Select items to dispute and provide details
          </Text>
        </Surface>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12, paddingHorizontal: 16 }}>
          Order Items
        </Text>

        {disputeItems.map((item) => {
          const product = products[item.product_id];
          return (
            <Surface key={item.product_id} style={styles.itemCard} elevation={1}>
              <View style={styles.itemHeader}>
                <TouchableOpacity
                  onPress={() => toggleDisputeItem(item.product_id)}
                  style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                >
                  <View style={[styles.checkbox, item.enabled && { backgroundColor: paperTheme.colors.primary }]}>
                    {item.enabled && (
                      <IconButton icon="check" size={16} iconColor={paperTheme.colors.onPrimary} style={{ margin: 0 }} />
                    )}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                      {product?.product_name || 'Loading...'}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Ordered: {item.ordered_quantity}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {item.enabled && (
                <View style={styles.disputeDetails}>
                  <Divider style={{ marginVertical: 12 }} />
                  
                  <View style={styles.inputRow}>
                    <Text variant="bodyMedium" style={{ flex: 1, color: paperTheme.colors.onSurfaceVariant }}>
                      Disputed Quantity
                    </Text>
                    <TextInput
                      style={[styles.quantityInput, {
                        backgroundColor: paperTheme.colors.surface,
                        color: paperTheme.colors.onSurface,
                        borderColor: paperTheme.colors.outline,
                      }]}
                      value={item.disputed_quantity}
                      onChangeText={(val) => updateDisputeQuantity(item.product_id, val)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={paperTheme.colors.onSurfaceVariant}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text variant="bodyMedium" style={{ flex: 1, color: paperTheme.colors.onSurfaceVariant }}>
                      Issue Type
                    </Text>
                    <Menu
                      visible={menuVisible[item.product_id] || false}
                      onDismiss={() => setMenuVisible({ ...menuVisible, [item.product_id]: false })}
                      anchor={
                        <TouchableOpacity
                          onPress={() => setMenuVisible({ ...menuVisible, [item.product_id]: true })}
                          style={[styles.dropdown, { borderColor: paperTheme.colors.outline }]}
                        >
                          <Text variant="bodySmall" style={{ flex: 1 }}>
                            {DISPUTE_TYPE_LABELS[item.issue_type]}
                          </Text>
                          <IconButton icon="chevron-down" size={20} style={{ margin: 0 }} />
                        </TouchableOpacity>
                      }
                    >
                      {Object.entries(DISPUTE_TYPES).map(([key, value]) => (
                        <Menu.Item
                          key={value}
                          onPress={() => updateIssueType(item.product_id, value)}
                          title={DISPUTE_TYPE_LABELS[value]}
                          leadingIcon={item.issue_type === value ? 'check' : undefined}
                        />
                      ))}
                    </Menu>
                  </View>

                  <Surface style={[styles.issueDescription, { backgroundColor: paperTheme.colors.surfaceVariant }]} elevation={0}>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      {DISPUTE_TYPE_DESCRIPTIONS[item.issue_type]}
                    </Text>
                  </Surface>
                </View>
              )}
            </Surface>
          );
        })}

        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
            Reason for Dispute
          </Text>
          <TextInput
            style={[styles.reasonInput, {
              backgroundColor: paperTheme.colors.surface,
              color: paperTheme.colors.onSurface,
              borderColor: paperTheme.colors.outline,
            }]}
            value={reason}
            onChangeText={setReason}
            placeholder="Provide a detailed explanation..."
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Surface style={styles.footer} elevation={4}>
        <PaperButton
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
          buttonColor={paperTheme.colors.error}
          textColor={paperTheme.colors.onError}
        >
          Submit Dispute
        </PaperButton>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoCard: {
    padding: 16,
  },
  warningCard: {
    padding: 12,
    borderRadius: 8,
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
  orderInfo: {
    gap: 4,
  },
  orderSummary: {
    padding: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disputeDetails: {
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 4,
    height: 40,
    minWidth: 180,
  },
  issueDescription: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  submitButton: {
    paddingVertical: 8,
  },
});
