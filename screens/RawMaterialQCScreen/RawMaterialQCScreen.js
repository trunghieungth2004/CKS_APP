import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Button, Snackbar, Divider, Chip } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import CustomDialog from '../../components/CustomDialog';
const { API_ENDPOINTS } = require('../../config/constants');
import { formatDate } from '../../utils/validators';

const QC_TABS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PASSED', label: 'Passed Today' },
];

export default function RawMaterialQCScreen({ onBack, onNavigate }) {
  const { paperTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('PENDING');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'info' });
  const [qcDialog, setQcDialog] = useState({ visible: false, batchId: null, result: null });
  const [notes, setNotes] = useState('');

  const isPending = selectedTab === 'PENDING';
  const isPassed = selectedTab === 'PASSED';

  useEffect(() => {
    setBatches([]);
    setLoading(true);
    if (isPending) {
      loadPendingBatches();
    } else if (isPassed) {
      loadPassedBatches();
    }
  }, [selectedTab]);

  const loadPendingBatches = async () => {
    const result = await apiService.get(API_ENDPOINTS.RAW_QC.PENDING);
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data) {
      setBatches(result.data.data);
    } else {
      setSnackbar({ visible: true, message: 'Failed to load pending batches', type: 'error' });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if (isPending) {
      loadPendingBatches();
    } else if (isPassed) {
      loadPassedBatches();
    }
  };

  const loadPassedBatches = async () => {
    const today = new Date().toISOString().split('T')[0];
    const result = await apiService.post(API_ENDPOINTS.RAW_BATCH.ALL, {
      qc_status: 'PASS',
      batch_date: today
    });

    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data) {
      setBatches(result.data.data);
    } else {
      setSnackbar({ visible: true, message: 'Failed to load passed batches', type: 'error' });
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

    const response = await apiService.post(API_ENDPOINTS.RAW_QC.PERFORM, payload);
    setProcessing(null);

    if (response.success) {
      setSnackbar({ 
        visible: true, 
        message: `Batch ${result === 'PASS' ? 'approved' : 'rejected'} successfully`, 
        type: 'success' 
      });
      loadPendingBatches();
    } else {
      setSnackbar({ 
        visible: true, 
        message: response.message || 'QC operation failed', 
        type: 'error' 
      });
    }
  };

  const handleBatchPress = (batchId) => {
    if (onNavigate) {
      onNavigate('RawBatchDetail', { batchId });
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
        <Appbar.Content title="Raw Material QC" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={[styles.tabContainer, { borderBottomColor: paperTheme.colors.outlineVariant }]}>
        {QC_TABS.map((tab) => (
          <Chip
            key={tab.value}
            mode={selectedTab === tab.value ? 'flat' : 'outlined'}
            selected={selectedTab === tab.value}
            onPress={() => setSelectedTab(tab.value)}
            disabled={loading}
            style={[
              styles.tabChip,
              selectedTab === tab.value && { backgroundColor: paperTheme.colors.primaryContainer }
            ]}
            textStyle={selectedTab === tab.value && { color: paperTheme.colors.onPrimaryContainer }}
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
              {isPending ? 'No pending QC batches' : 'No passed batches for today'}
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
                      {formatDate(batch.received_date || batch.created_at || batch.batch_date)}
                    </Text>
                  </View>
                  <Chip
                    mode="flat"
                    compact
                    style={{ backgroundColor: isPassed ? '#34C759' : paperTheme.colors.tertiaryContainer }}
                    textStyle={{ color: isPassed ? '#FFFFFF' : paperTheme.colors.onTertiaryContainer, fontSize: 11, fontWeight: '600' }}
                  >
                    {isPassed ? 'PASS' : 'PENDING'}
                  </Chip>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Material
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {batch.material_name || 'N/A'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Quantity
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {batch.quantity || 0} kg
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Supplier
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {batch.supplier_name || 'N/A'}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  tabChip: {
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
