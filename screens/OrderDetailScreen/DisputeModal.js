import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Text, Surface, ActivityIndicator, Divider, Menu, IconButton, Button as PaperButton } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { DISPUTE_TYPES, DISPUTE_TYPE_LABELS, DISPUTE_TYPE_DESCRIPTIONS } from '../../config/constants';

export default function DisputeModal({ visible, order, products, onClose, onSuccess }) {
  const { paperTheme } = useTheme();
  const [disputeItems, setDisputeItems] = useState([]);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  useEffect(() => {
    if (visible && order) {
      setDisputeItems(
        order.items.map(item => ({
          product_id: item.product_id,
          ordered_quantity: item.quantity,
          disputed_quantity: '',
          issue_type: DISPUTE_TYPES.MISSING,
          enabled: false,
        }))
      );
      setReason('');
    }
  }, [visible, order]);

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
      order_id: order.order_id,
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
            onSuccess();
            onClose();
          },
        },
      ]);
    } else {
      Alert.alert('Error', result.message || 'Failed to file dispute');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: paperTheme.colors.surface, borderBottomColor: paperTheme.colors.outlineVariant }]}>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
            File Dispute
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
          />
        </View>

        <View style={styles.orderInfo}>
          <Surface style={[styles.infoCard, { backgroundColor: paperTheme.colors.surfaceVariant }]} elevation={0}>
            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
              Order: {order?.order_id}
            </Text>
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
              Select items to dispute and provide details
            </Text>
          </Surface>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
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
                    <View style={[styles.checkbox, item.enabled && { backgroundColor: paperTheme.colors.primary, borderColor: paperTheme.colors.primary }]}>
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

          <View style={{ marginTop: 16 }}>
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
            mode="outlined"
            onPress={onClose}
            style={[styles.button, { marginRight: 8 }]}
            disabled={submitting}
          >
            Cancel
          </PaperButton>
          <PaperButton
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
            style={styles.button}
            buttonColor={paperTheme.colors.error}
            textColor={paperTheme.colors.onError}
          >
            Submit Dispute
          </PaperButton>
        </Surface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  orderInfo: {
    padding: 16,
    paddingBottom: 8,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 6,
  },
});
