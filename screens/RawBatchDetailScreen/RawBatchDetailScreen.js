import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { formatDate, formatDateTime } from '../../utils/validators';

const QC_STATUS_COLORS = {
  PASS: '#34C759',
  FAIL: '#FF3B30',
  PENDING: '#FF9500',
};

export default function RawBatchDetailScreen({ batchId, onBack }) {
  const { paperTheme } = useTheme();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatchDetails();
  }, [batchId]);

  const loadBatchDetails = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.RAW_BATCH.ONE, { batch_id: batchId });

    if (result.success && result.data.data) {
      setBatch(result.data.data.batch);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Raw Batch Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading batch...</Text>
        </View>
      </View>
    );
  }

  if (!batch) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Raw Batch Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            Batch not found
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
        <Appbar.Content title="Raw Batch Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Batch Header */}
        <Surface style={styles.card} elevation={1}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
              {batch.batch_id}
            </Text>
            <Chip
              mode="flat"
              style={{ backgroundColor: QC_STATUS_COLORS[batch.qc_status] }}
              textStyle={styles.statusText}
            >
              {batch.qc_status}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          {/* Batch Information */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Batch Information</Text>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Batch Number
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.batch_number}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Material
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.material_name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Quantity
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.quantity?.toFixed(2)} {batch.unit}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Batch Date
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {formatDate(batch.batch_date)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Created
              </Text>
              <Text variant="bodyMedium">
                {formatDateTime(batch.created_at)}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Supplier Information */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Supplier Information</Text>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Supplier
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.supplier_name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Supplier ID
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.supplier_id}
              </Text>
            </View>
          </View>

          {batch.qc_status !== 'PENDING' && (
            <>
              <Divider style={styles.divider} />

              {/* QC Information */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Quality Control</Text>
                
                {batch.qc_by && (
                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      QC By
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {batch.qc_by}
                    </Text>
                  </View>
                )}

                {batch.qc_date && (
                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      QC Date
                    </Text>
                    <Text variant="bodyMedium">
                      {formatDateTime(batch.qc_date)}
                    </Text>
                  </View>
                )}

                {batch.notes && (
                  <View style={styles.notesContainer}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 4 }}>
                      Notes
                    </Text>
                    <Text variant="bodyMedium">{batch.notes}</Text>
                  </View>
                )}
              </View>
            </>
          )}
        </Surface>
      </ScrollView>
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
});
