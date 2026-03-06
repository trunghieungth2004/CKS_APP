import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog, RiskPoolModal } from '../../components';
import apiService from '../../services/apiService';
import { formatDate, formatDateTime } from '../../utils/validators';
import { API_ENDPOINTS } from '../../config/constants';

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

export default function SupplyOrderDetailScreen({ orderId, onBack, onNavigateTab, onNavigate }) {
  const { paperTheme } = useTheme();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false });
  const [cookedBatches, setCookedBatches] = useState([]);
  const [batchesModalVisible, setBatchesModalVisible] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [riskPoolModal, setRiskPoolModal] = useState({ visible: false, failedBatch: null });
  const [riskPoolSearch, setRiskPoolSearch] = useState({ loading: false, results: [], selectedProduct: null });
  const [transferring, setTransferring] = useState(null);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.ORDER.ONE, { order_id: orderId });

    if (result.success && result.data.data) {
      const orderData = result.data.data;
      setOrder(orderData);
      
      const productIds = orderData.items.map(item => item.product_id);
      await loadProductDetails(productIds);
    } else {
      setDialog({ 
        visible: true, 
        title: 'Error', 
        message: 'Failed to load order details', 
        type: 'error', 
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          onBack();
        }, 
        showCancel: false 
      });
    }
    
    setLoading(false);
  };

  const loadProductDetails = async (productIds) => {
    const productMap = {};
    for (const productId of productIds) {
      const result = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, { productId: productId });
      if (result.success && result.data.data) {
        productMap[productId] = result.data.data;
      }
    }
    setProducts(productMap);
  };

  const loadCookedBatches = async () => {
    setLoadingBatches(true);
    setBatchesModalVisible(true);
    
    const result = await apiService.post(API_ENDPOINTS.COOKED_BATCH.BY_ORDER, { order_id: orderId });
    
    if (result.success && result.data.data) {
      setCookedBatches(result.data.data);
    } else {
      setCookedBatches([]);
      setDialog({
        visible: true,
        title: 'Error',
        message: result.message || 'Failed to load cooked batches',
        type: 'error',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false,
      });
    }
    
    setLoadingBatches(false);
  };

  const handleBatchPress = (batchId) => {
    setBatchesModalVisible(false);
    if (onNavigate) {
      onNavigate('CookedBatchDetail', { batchId });
    }
  };

  const handleRiskPool = () => {
    const failedBatch = cookedBatches.find(batch => batch.qc_status === 'FAIL');
    if (failedBatch) {
      setRiskPoolModal({ visible: true, failedBatch });
    }
  };

  const handleRiskPoolSearch = async (productId, quantity) => {
    if (!riskPoolModal.failedBatch || !riskPoolModal.failedBatch.store_id) {
      console.error('Batch store_id is not available, cannot search risk pool');
      setDialog({ 
        visible: true, 
        title: 'Error', 
        message: 'Batch store information not available', 
        type: 'error',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false
      });
      return;
    }
    
    setRiskPoolSearch({ loading: true, results: [], selectedProduct: { productId, quantity } });

    const response = await apiService.post(API_ENDPOINTS.COOKED_QC.RISK_POOL_SEARCH, {
      product_id: productId,
      quantity: quantity,
      store_staff_id: riskPoolModal.failedBatch.store_id,
    });
    
    if (response.success && response.data.data) {
      setRiskPoolSearch({ loading: false, results: response.data.data, selectedProduct: { productId, quantity } });
    } else {
      setRiskPoolSearch({ loading: false, results: [], selectedProduct: { productId, quantity } });
      setDialog({ 
        visible: true, 
        title: 'Info', 
        message: 'No available stores found', 
        type: 'info',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false
      });
    }
  };

  const handleRiskPoolTransfer = async (storeData) => {
    if (!riskPoolModal.failedBatch) return;
    
    setTransferring(storeData.store_staff_id);
    
    const response = await apiService.post(API_ENDPOINTS.COOKED_QC.RISK_POOL_TRANSFER, {
      batch_id: riskPoolModal.failedBatch.batch_id,
      product_id: storeData.product_id,
      quantity: storeData.quantity_needed,
      from_store_staff_id: storeData.store_staff_id,
      notes: 'Emergency replacement for failed batch'
    });
    
    setTransferring(null);
    
    if (response.success) {
      setDialog({ 
        visible: true, 
        title: 'Success', 
        message: 'Transfer completed successfully', 
        type: 'success',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false
      });
      setRiskPoolModal({ visible: false, failedBatch: null });
      setRiskPoolSearch({ loading: false, results: [], selectedProduct: null });
      loadCookedBatches();
    } else {
      setDialog({ 
        visible: true, 
        title: 'Error', 
        message: response.message || 'Transfer failed', 
        type: 'error',
        onConfirm: () => setDialog({ ...dialog, visible: false }),
        showCancel: false
      });
    }
  };

  const closeRiskPoolModal = () => {
    setRiskPoolModal({ visible: false, failedBatch: null });
    setRiskPoolSearch({ loading: false, results: [], selectedProduct: null });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading order...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            Order not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title="Order Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={1}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
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

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Order Information</Text>
          
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Store</Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{order.store_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Delivery Date</Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{formatDate(order.delivery_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Created</Text>
              <Text variant="bodyMedium">{formatDateTime(order.created_at)}</Text>
            </View>
            {order.notes && (
              <View style={styles.notesContainer}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 4 }}>
                  Notes
                </Text>
                <Text variant="bodyMedium">{order.notes}</Text>
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
            {order.items && order.items.map((item, index) => {
              const product = products[item.product_id];
              
              return (
                <Surface key={index} style={[styles.itemCard, { borderColor: paperTheme.colors.outlineVariant }]} elevation={0}>
                  <View style={styles.itemContent}>
                    <View style={styles.itemInfo}>
                      <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                        {product?.product_name || item.product_id}
                      </Text>
                      {product?.product_description && (
                        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                          {product.product_description}
                        </Text>
                      )}
                      {product?.price && (
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600', marginTop: 4 }}>
                          ${Number(product.price).toFixed(2)} each
                        </Text>
                      )}
                    </View>
                    <View style={styles.quantityBadge}>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Quantity
                      </Text>
                      <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                        {item.quantity}
                      </Text>
                    </View>
                  </View>
                  {product?.price && (
                    <View style={[styles.itemTotal, { borderTopColor: paperTheme.colors.outlineVariant }]}>
                      <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Item Total
                      </Text>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                        ${(Number(product.price) * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  )}
                </Surface>
              );
            })}
            
            <Button
              mode="outlined"
              onPress={loadCookedBatches}
              icon="package-variant"
              style={{ marginTop: 8 }}
              contentStyle={{ paddingVertical: 8 }}
            >
              View Cooked Batches
            </Button>

            {cookedBatches.length > 0 && cookedBatches.some(batch => batch.qc_status === 'FAIL') && (
              <Button
                mode="contained"
                onPress={handleRiskPool}
                icon="package-variant-closed"
                style={{ marginTop: 8, backgroundColor: paperTheme.colors.error }}
                contentStyle={{ paddingVertical: 8 }}
              >
                Use Risk Pool
              </Button>
            )}
          </View>
        </Surface>

        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Subtotal
              </Text>
              <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
                ${(order.subtotal || 0).toFixed(2)}
              </Text>
            </View>
            {order.credits_applied > 0 && (
              <View style={styles.summaryRow}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.tertiary }}>
                  Credits Applied
                </Text>
                <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: paperTheme.colors.tertiary }}>
                  -${(order.credits_applied || 0).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, { paddingTop: 8, borderTopWidth: 1, borderTopColor: paperTheme.colors.outlineVariant }]}>
              <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                Total
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                ${(order.total_after_credits !== undefined ? order.total_after_credits : order.subtotal || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </Surface>

        {order.history && order.history.length > 0 && (
          <Surface style={styles.card} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Order History</Text>
            
            {order.history.map((entry, index) => (
              <View key={entry.history_id || index} style={styles.historyEntry}>
                <View style={styles.historyDot}>
                  <View style={[styles.dot, { backgroundColor: STATUS_COLORS[entry.to_status_id] || paperTheme.colors.primary }]} />
                  {index < order.history.length - 1 && (
                    <View style={[styles.line, { backgroundColor: paperTheme.colors.outlineVariant }]} />
                  )}
                </View>
                
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {STATUS_NAMES[entry.to_status_id] || entry.to_status_id}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      {formatDateTime(entry.changed_at || entry.created_at)}
                    </Text>
                  </View>
                  
                  {entry.changed_by && (
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                      by {entry.changed_by}
                    </Text>
                  )}
                  {entry.notes && (
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                      {entry.notes}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Surface>
        )}
      </ScrollView>

      <RiskPoolModal
        visible={riskPoolModal.visible}
        failedBatch={riskPoolModal.failedBatch}
        riskPoolSearch={riskPoolSearch}
        transferring={transferring}
        onClose={closeRiskPoolModal}
        onSearch={handleRiskPoolSearch}
        onTransfer={handleRiskPoolTransfer}
      />

      <CustomDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onDismiss={() => setDialog({ ...dialog, visible: false })}
        onConfirm={dialog.onConfirm}
        showCancel={dialog.showCancel}
        confirmText={dialog.confirmText}
      />

      <Modal
        visible={batchesModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setBatchesModalVisible(false)}
      >
        <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
          <Appbar.Header elevated>
            <Appbar.BackAction onPress={() => setBatchesModalVisible(false)} />
            <Appbar.Content title="Cooked Batches" />
          </Appbar.Header>

          {loadingBatches ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" />
              <Text variant="bodyLarge" style={styles.loadingText}>Loading batches...</Text>
            </View>
          ) : cookedBatches.length === 0 ? (
            <View style={styles.centerContent}>
              <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                No cooked batches found for this order
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {cookedBatches.map((batch) => (
                <TouchableOpacity
                  key={batch.batch_id}
                  onPress={() => handleBatchPress(batch.batch_id)}
                  activeOpacity={0.7}
                >
                  <Surface style={styles.batchCard} elevation={1}>
                    <View style={styles.batchHeader}>
                      <View style={{ flex: 1 }}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                          {batch.batch_number || batch.batch_id}
                        </Text>
                        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                          Batch {batch.batch_number} of {batch.total_batches}
                        </Text>
                      </View>
                      <Chip
                        mode="flat"
                        compact
                        style={{
                          backgroundColor: 
                            batch.qc_status === 'PASS' ? '#D4EDDA' :
                            batch.qc_status === 'FAIL' ? '#F8D7DA' :
                            paperTheme.colors.tertiaryContainer
                        }}
                        textStyle={{
                          color: 
                            batch.qc_status === 'PASS' ? '#155724' :
                            batch.qc_status === 'FAIL' ? '#721C24' :
                            paperTheme.colors.onTertiaryContainer,
                          fontSize: 11,
                          fontWeight: '600'
                        }}
                      >
                        {batch.qc_status || 'PENDING'}
                      </Chip>
                    </View>

                    <Divider style={{ marginVertical: 12 }} />

                    <View style={styles.infoRow}>
                      <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Store
                      </Text>
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {batch.store_id}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Total Weight
                      </Text>
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {batch.total_weight || 0} kg
                      </Text>
                    </View>

                    {batch.items && (
                      <View style={styles.infoRow}>
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                          Items
                        </Text>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          {batch.items.length}
                        </Text>
                      </View>
                    )}

                    {batch.cooked_at && (
                      <View style={styles.infoRow}>
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                          Cooked At
                        </Text>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          {formatDateTime(batch.cooked_at)}
                        </Text>
                      </View>
                    )}
                  </Surface>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {dialog.visible && (
        <View style={styles.backdrop} pointerEvents="auto" />
      )}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  notesContainer: {
    marginTop: 8,
  },
  actionButton: {
    marginVertical: 8,
  },
  itemCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryContainer: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    alignItems: 'center',
  },
  historyEntry: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyDot: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'column',
    gap: 4,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  batchCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
