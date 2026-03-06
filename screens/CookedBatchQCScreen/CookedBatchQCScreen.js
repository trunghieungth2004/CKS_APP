import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Button, Snackbar, Divider, Chip } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { CustomDialog, RiskPoolModal } from '../../components';
import { formatDateTime } from '../../utils/validators';
import { API_ENDPOINTS } from '../../config/constants';

const QC_TABS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PASSED', label: 'Passed Today' },
  { value: 'FAILED', label: 'Failed Today' },
];

export default function CookedBatchQCScreen({ onBack, onNavigate, initialTab, onTabChange }) {
  const { paperTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState(initialTab || 'PENDING');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'info' });
  const [qcDialog, setQcDialog] = useState({ visible: false, batchId: null, result: null });
  const [notes, setNotes] = useState('');
  const [riskPoolModal, setRiskPoolModal] = useState({ visible: false, failedBatch: null });
  const [riskPoolSearch, setRiskPoolSearch] = useState({ loading: false, results: [], selectedProduct: null });
  const [transferring, setTransferring] = useState(null);

  const isPending = selectedTab === 'PENDING';
  const isPassed = selectedTab === 'PASSED';
  const isFailed = selectedTab === 'FAILED';

  useEffect(() => {
    setBatches([]);
    setLoading(true);
    if (isPending) {
      loadPendingBatches();
    } else if (isPassed) {
      loadPassedBatches();
    } else if (isFailed) {
      loadFailedBatches();
    }
  }, [selectedTab]);

  const loadPendingBatches = async () => {
    try {
      const result = await apiService.post(API_ENDPOINTS.COOKED_QC.PENDING);
      
      if (result.success && result.data?.data) {
        setBatches(result.data.data);
      } else {
        setBatches([]);
        setSnackbar({ visible: true, message: result.message || 'Failed to load pending batches', type: 'error' });
      }
    } catch (error) {
      console.error('Error loading pending batches:', error);
      setBatches([]);
      setSnackbar({ visible: true, message: 'Failed to load pending batches', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (isPending) {
      loadPendingBatches();
    } else if (isPassed) {
      loadPassedBatches();
    } else if (isFailed) {
      loadFailedBatches();
    }
  };

  const loadPassedBatches = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await apiService.post(API_ENDPOINTS.COOKED_BATCH.ALL, {
        qc_status: 'PASS',
        cook_date: today
      });

      if (result.success && result.data?.data) {
        setBatches(result.data.data);
      } else {
        setBatches([]);
        setSnackbar({ visible: true, message: result.message || 'Failed to load passed batches', type: 'error' });
      }
    } catch (error) {
      console.error('Error loading passed batches:', error);
      setBatches([]);
      setSnackbar({ visible: true, message: 'Failed to load passed batches', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFailedBatches = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await apiService.post(API_ENDPOINTS.COOKED_BATCH.ALL, {
        qc_status: 'FAIL',
        cook_date: today
      });

      if (result.success && result.data?.data) {
        setBatches(result.data.data);
      } else {
        setBatches([]);
        setSnackbar({ visible: true, message: result.message || 'Failed to load failed batches', type: 'error' });
      }
    } catch (error) {
      console.error('Error loading failed batches:', error);
      setBatches([]);
      setSnackbar({ visible: true, message: 'Failed to load failed batches', type: 'error' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showQCDialog = (batchId, result) => {
    setQcDialog({ visible: true, batchId, result });
    setNotes('');
  };

  const hideQCDialog = () => {
    setQcDialog({ visible: false, batchId: null, result: null });
    setNotes('');
  };

  const handleQCConfirm = async () => {
    const { batchId, result } = qcDialog;
    hideQCDialog();
    setProcessing(batchId);

    const payload = {
      batch_id: batchId,
      qc_result: result,
      notes: notes || (result === 'PASS' ? 'Quality check passed' : 'Quality check failed'),
    };

    const response = await apiService.post(API_ENDPOINTS.COOKED_QC.PERFORM, payload);
    setProcessing(null);

    if (response.success) {
      setSnackbar({ 
        visible: true, 
        message: `Batch ${result === 'PASS' ? 'approved' : 'rejected'} successfully`, 
        type: 'success' 
      });
      
      if (result === 'FAIL') {
        const failedBatchData = batches.find(b => b.batch_id === batchId);
        if (failedBatchData && failedBatchData.items && failedBatchData.items.length > 0) {
          setTimeout(() => {
            setRiskPoolModal({ visible: true, failedBatch: failedBatchData });
          }, 500);
        }
      }
      
      loadPendingBatches();
    } else {
      setSnackbar({ 
        visible: true, 
        message: response.message || 'QC operation failed', 
        type: 'error' 
      });
    }
  };

  const handleRiskPoolSearch = async (productId, quantity) => {
    if (!riskPoolModal.failedBatch || !riskPoolModal.failedBatch.store_id) {
      console.error('Batch store_id is not available, cannot search risk pool');
      setSnackbar({ visible: true, message: 'Batch store information not available', type: 'error' });
      return;
    }
    
    setRiskPoolSearch({ loading: true, results: [], selectedProduct: { productId, quantity } });

    const response = await apiService.post(API_ENDPOINTS.COOKED_QC.RISK_POOL_SEARCH, {
      batch_id: riskPoolModal.failedBatch.batch_id,
      exclude_store_staff_id: riskPoolModal.failedBatch.store_id,
    });
    
    
    if (response.success && response.data.data) {
      setRiskPoolSearch({ loading: false, results: response.data.data, selectedProduct: { productId, quantity } });
    } else {
      setRiskPoolSearch({ loading: false, results: [], selectedProduct: { productId, quantity } });
      setSnackbar({ visible: true, message: 'No available stores found', type: 'info' });
    }
  };

  const handleRiskPoolTransfer = async (storeData) => {
    if (!riskPoolModal.failedBatch) return;
    
    setTransferring(storeData.store_staff_id);
    
    const response = await apiService.post(API_ENDPOINTS.COOKED_QC.RISK_POOL_TRANSFER, {
      batch_id: riskPoolModal.failedBatch.batch_id,
      from_store_staff_id: storeData.store_staff_id,
      notes: 'Emergency replacement for failed batch'
    });
    
    setTransferring(null);
    
    if (response.success) {
      setSnackbar({ visible: true, message: 'Transfer completed successfully', type: 'success' });
      setRiskPoolModal({ visible: false, failedBatch: null });
      setRiskPoolSearch({ loading: false, results: [], selectedProduct: null });
      loadPendingBatches();
    } else {
      setSnackbar({ visible: true, message: response.message || 'Transfer failed', type: 'error' });
    }
  };

  const closeRiskPoolModal = () => {
    setRiskPoolModal({ visible: false, failedBatch: null });
    setRiskPoolSearch({ loading: false, results: [], selectedProduct: null });
  };

  const handleBatchPress = (batchId) => {
    if (onNavigate) {
      onNavigate('CookedBatchDetail', { batchId });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        {onBack && <Appbar.BackAction onPress={onBack} />}
        <Appbar.Content title="Cooked Batch QC" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.tabContainer}>
        {QC_TABS.map(tab => (
          <Chip
            key={tab.value}
            mode="outlined"
            selected={selectedTab === tab.value}
            onPress={() => {
              setSelectedTab(tab.value);
              if (onTabChange) onTabChange(tab.value);
            }}
            style={styles.tabChip}
            disabled={loading}
          >
            {tab.label}
          </Chip>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[paperTheme.colors.primary]} />
        }
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading batches...</Text>
          </View>
        ) : batches.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              {isPending ? 'No pending QC batches' : isPassed ? 'No passed batches for today' : 'No failed batches for today'}
            </Text>
          </View>
        ) : (
          batches.map((batch) => (
            <TouchableOpacity 
              key={batch.batch_id} 
              onPress={() => handleBatchPress(batch.batch_id)}
              activeOpacity={0.7}
            >
              <Surface style={styles.batchCard} elevation={1}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {batch.batch_id}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                      Cooked: {formatDate(batch.cooked_at || batch.created_at)}
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    compact
                    style={{ backgroundColor: isPassed ? '#4CAF50' : isFailed ? '#F44336' : paperTheme.colors.tertiaryContainer }}
                    textStyle={{ color: (isPassed || isFailed) ? '#FFF' : paperTheme.colors.onTertiaryContainer, fontSize: 11, fontWeight: '600' }}
                  >
                    {isPassed ? 'PASS' : isFailed ? 'FAIL' : 'PENDING'}
                  </Chip>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Order ID
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {batch.order_id || 'N/A'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Store
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {batch.store_id || 'N/A'}
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

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Items
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {batch.items?.length || 0} products
                  </Text>
                </View>

                {isPending && (
                  <View style={styles.buttonRow}>
                    <Button
                      mode="contained"
                      onPress={(e) => {
                        e.stopPropagation();
                        showQCDialog(batch.batch_id, 'PASS');
                      }}
                      disabled={processing === batch.batch_id}
                      loading={processing === batch.batch_id && qcDialog.result === 'PASS'}
                      style={styles.actionButton}
                      contentStyle={{ paddingVertical: 4 }}
                    >
                      PASS
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={(e) => {
                        e.stopPropagation();
                        showQCDialog(batch.batch_id, 'FAIL');
                      }}
                      disabled={processing === batch.batch_id}
                      loading={processing === batch.batch_id && qcDialog.result === 'FAIL'}
                      style={[styles.actionButton, { borderColor: paperTheme.colors.error }]}
                      textColor={paperTheme.colors.error}
                      contentStyle={{ paddingVertical: 4 }}
                    >
                      FAIL
                    </Button>
                  </View>
                )}

                {isFailed && (
                  <Button
                    mode="contained"
                    onPress={(e) => {
                      e.stopPropagation();
                      setRiskPoolModal({ visible: true, failedBatch: batch });
                    }}
                    style={{ marginTop: 16 }}
                    icon="swap-horizontal"
                  >
                    Use Risk Pool
                  </Button>
                )}
              </Surface>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <CustomDialog
        visible={qcDialog.visible}
        title={`${qcDialog.result} QC`}
        message="Add notes for this quality check (optional)"
        onDismiss={hideQCDialog}
        onConfirm={handleQCConfirm}
        confirmText="Confirm"
        showInput
        inputProps={{
          placeholder: 'Enter QC notes...',
          value: notes,
          onChangeText: setNotes,
        }}
      />

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{ 
          backgroundColor: snackbar.type === 'error' 
            ? paperTheme.colors.errorContainer 
            : snackbar.type === 'success'
            ? paperTheme.colors.primaryContainer
            : paperTheme.colors.surfaceVariant
        }}
      >
        <Text style={{ 
          color: snackbar.type === 'error' 
            ? paperTheme.colors.onErrorContainer 
            : snackbar.type === 'success'
            ? paperTheme.colors.onPrimaryContainer
            : paperTheme.colors.onSurfaceVariant
        }}>
          {snackbar.message}
        </Text>
      </Snackbar>

      {(processing || qcDialog.visible) && (
        <View style={styles.backdrop} pointerEvents="auto" />
      )}

      <RiskPoolModal
        visible={riskPoolModal.visible}
        failedBatch={riskPoolModal.failedBatch}
        riskPoolSearch={riskPoolSearch}
        transferring={transferring}
        onClose={closeRiskPoolModal}
        onSearch={handleRiskPoolSearch}
        onTransfer={handleRiskPoolTransfer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  batchCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tabChip: {
    flex: 1,
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
});

