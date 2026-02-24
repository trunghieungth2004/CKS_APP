import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Card } from '../../components';
import apiService from '../../services/apiService';
import styles from './RawMaterialQCScreen.styles';

export default function RawMaterialQCScreen({ onBack }) {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadPendingBatches();
  }, []);

  const loadPendingBatches = async () => {
    const result = await apiService.get('/api/raw-qc/pending');
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

  const handleQC = async (batchId, qcStatus) => {
    setProcessing(batchId);

    const qcNotes = qcStatus === 'PASS' 
      ? 'Quality check passed. Material meets standards.'
      : 'Quality check failed. Material rejected.';

    const payload = {
      batch_id: batchId,
      qc_status: qcStatus,
      qc_notes: qcNotes,
    };

    if (qcStatus === 'FAIL') {
      payload.waste_reason = 'QUALITY_FAILURE';
    }

    const result = await apiService.post('/api/raw-qc/perform', payload);
    setProcessing(null);

    if (result.success) {
      Alert.alert('Success', `Batch ${qcStatus === 'PASS' ? 'approved' : 'rejected'}`);
      loadPendingBatches();
    } else {
      Alert.alert('Error', result.message || 'QC operation failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Raw Material QC</Text>
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
                <Text style={styles.infoLabel}>Material:</Text>
                <Text style={styles.infoValue}>{batch.material_name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Quantity:</Text>
                <Text style={styles.infoValue}>{batch.quantity} kg</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Supplier:</Text>
                <Text style={styles.infoValue}>{batch.supplier_name}</Text>
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
                    onPress={() => handleQC(batch.batch_id, 'FAIL')}
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
