import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Card } from '../../components';
import apiService from '../../services/apiService';
import styles from './CookedBatchQCScreen.styles';

export default function CookedBatchQCScreen({ onBack }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadPendingBatches();
  }, []);

  const loadPendingBatches = async () => {
    const result = await apiService.post('/api/cooked-qc/pending', {});
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data) {
      setBatches(result.data.data);
    } else {
      Alert.alert('Error', 'Failed to load pending batches');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPendingBatches();
  };

  const handleQC = async (batchId, qcStatus, failureReason = null) => {
    setProcessing(batchId);

    const payload = {
      batch_id: batchId,
      qc_status: qcStatus,
      qc_notes: qcStatus === 'PASS' ? 'Meets quality standards' : 'Quality issue detected',
    };

    if (qcStatus === 'FAIL' && failureReason) {
      payload.failure_reason = failureReason;
    }

    const result = await apiService.post('/api/cooked-qc/perform', payload);
    setProcessing(null);

    if (result.success) {
      Alert.alert('Success', `Batch ${qcStatus === 'PASS' ? 'approved' : 'sent to ' + failureReason.toLowerCase()}`);
      loadPendingBatches();
    } else {
      Alert.alert('Error', result.message || 'QC operation failed');
    }
  };

  const showFailOptions = (batchId) => {
    Alert.alert(
      'Batch Failed QC',
      'Where should this batch go?',
      [
        {
          text: 'Risk Pool',
          onPress: () => handleQC(batchId, 'FAIL', 'RISK_POOL'),
        },
        {
          text: 'Waste',
          onPress: () => handleQC(batchId, 'FAIL', 'WASTE'),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Cooked Batch QC</Text>
        <Text style={styles.subtitle}>Quality Control Pending</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Text style={styles.loadingText}>Loading batches...</Text>
        ) : batches.length === 0 ? (
          <Text style={styles.emptyText}>No pending QC batches</Text>
        ) : (
          batches.map(batch => (
            <Card key={batch.batch_id}>
              <View style={styles.batchHeader}>
                <Text style={styles.batchId}>{batch.batch_id}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>PENDING</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Product:</Text>
                <Text style={styles.infoValue}>{batch.product_name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Quantity:</Text>
                <Text style={styles.infoValue}>{batch.quantity} kg</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Store:</Text>
                <Text style={styles.infoValue}>{batch.store_name}</Text>
              </View>

              <View style={styles.actions}>
                <View style={styles.buttonRow}>
                  <Button
                    title="PASS"
                    onPress={() => handleQC(batch.batch_id, 'PASS')}
                    loading={processing === batch.batch_id}
                    variant="success"
                    style={styles.actionButton}
                  />
                  <Button
                    title="FAIL"
                    onPress={() => showFailOptions(batch.batch_id)}
                    loading={processing === batch.batch_id}
                    variant="danger"
                    style={styles.actionButton}
                  />
                </View>
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
