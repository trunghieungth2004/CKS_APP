import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { formatDateTime } from '../../utils/validators';
import { API_ENDPOINTS } from '../../config/constants';

const QC_STATUS_COLORS = {
  PASS: '#34C759',
  FAIL: '#FF3B30',
  PENDING: '#FF9500',
};

export default function CookedBatchDetailScreen({ batchId, onBack, onNavigate }) {
  const { paperTheme } = useTheme();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBatchDetails();
  }, [batchId]);

  const loadBatchDetails = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.COOKED_BATCH.ONE, { batch_id: batchId });

    if (result.success && result.data.data) {
      setBatch(result.data.data);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Cooked Batch Details" />
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
          <Appbar.Content title="Cooked Batch Details" />
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
        <Appbar.Content title="Cooked Batch Details" />
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
                Order ID
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.order_id}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Store ID
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.store_staff_id || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Batch Number
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.batch_number} of {batch.total_batches}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Total Weight
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.total_weight} kg
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Cooked At
              </Text>
              <Text variant="bodyMedium">
                {formatDateTime(batch.cooked_at)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Cooked By
              </Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                {batch.cooked_by}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* View Order Button */}
          <View style={styles.section}>
            <Button
              mode="contained"
              onPress={() => onNavigate && onNavigate('CKOrderDetail', { orderId: batch.order_id })}
              icon="clipboard-text"
              disabled={!onNavigate}
              contentStyle={{ paddingVertical: 8 }}
            >
              View Order Details
            </Button>
          </View>

          <Divider style={styles.divider} />

          {/* Batch Items */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Batch Items ({batch.items?.length || 0})</Text>
            
            {batch.items && batch.items.map((item, index) => (
              <Surface 
                key={index} 
                style={[styles.itemCard, { borderColor: paperTheme.colors.outlineVariant }]} 
                elevation={0}
              >
                <View style={styles.itemContent}>
                  <View style={styles.itemInfo}>
                    <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                      {item.product_name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                      Weight per unit: {item.weight_per_unit} kg
                    </Text>
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
                <View style={[styles.itemTotal, { borderTopColor: paperTheme.colors.outlineVariant }]}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Total Weight
                  </Text>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                    {item.total_weight} kg
                  </Text>
                </View>
              </Surface>
            ))}
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
});
