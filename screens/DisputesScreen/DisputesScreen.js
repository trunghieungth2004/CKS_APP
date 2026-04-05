import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider, Button, Portal, Modal } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { CustomDialog } from '../../components';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { formatDateTime } from '../../utils/validators';
import { DISPUTE_TYPE_LABELS } from '../../config/constants';

export default function DisputesScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [disputes, setDisputes] = useState([]);
  const [products, setProducts] = useState({});
  const [expandedDispute, setExpandedDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resolveDialog, setResolveDialog] = useState({ visible: false, disputeId: null });
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.DISPUTE.MY_DISPUTES, {});
    if (result.success && result.data.data) {
      const disputesData = result.data.data;
      
      const allProductIds = new Set();
      disputesData.forEach(dispute => {
        dispute.items?.forEach(item => allProductIds.add(item.product_id));
      });
      
      const productMap = {};
      for (const productId of allProductIds) {
        const result = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, { productId });
        if (result.success && result.data.data) {
          productMap[productId] = result.data.data;
        }
      }
      setProducts(productMap);
      setDisputes(disputesData);
    }
    
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDisputes();
    setRefreshing(false);
  };

  const toggleExpand = (disputeId) => {
    setExpandedDispute(expandedDispute === disputeId ? null : disputeId);
  };

  const showResolveDialog = (disputeId) => {
    setResolveDialog({ visible: true, disputeId });
    setResolutionNotes('');
  };

  const hideResolveDialog = () => {
    setResolveDialog({ visible: false, disputeId: null });
    setResolutionNotes('');
  };

  const handleResolve = async (resolutionType) => {
    if (!resolveDialog.disputeId) return;
    
    setResolving(true);
    const result = await apiService.post(API_ENDPOINTS.DISPUTE.RESOLVE, {
      dispute_id: resolveDialog.disputeId,
      resolution_type: resolutionType,
      resolution_notes: resolutionNotes || `Dispute ${resolutionType === 'APPROVE' ? 'approved' : 'rejected'} by manager`,
    });
    setResolving(false);

    if (result.success) {
      hideResolveDialog();
      loadDisputes();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return paperTheme.colors.primaryContainer;
      case 'PENDING':
        return paperTheme.colors.tertiaryContainer;
      case 'REJECTED':
        return paperTheme.colors.errorContainer;
      default:
        return paperTheme.colors.surfaceVariant;
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return paperTheme.colors.onPrimaryContainer;
      case 'PENDING':
        return paperTheme.colors.onTertiaryContainer;
      case 'REJECTED':
        return paperTheme.colors.onErrorContainer;
      default:
        return paperTheme.colors.onSurfaceVariant;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="My Disputes" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[paperTheme.colors.primary]} />
        }
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading disputes...</Text>
          </View>
        ) : disputes.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              No disputes found
            </Text>
          </View>
        ) : (
          disputes.map((dispute) => {
            const isExpanded = expandedDispute === dispute.dispute_id;

            return (
              <Surface key={dispute.dispute_id} style={styles.disputeCard} elevation={1}>
                <Pressable onPress={() => toggleExpand(dispute.dispute_id)}>
                  <View style={styles.disputeHeader}>
                    <View style={{ flex: 1 }}>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                        Dispute #{dispute.dispute_id}
                      </Text>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                        Order: {dispute.order_id} | Store: {dispute.store_id}
                      </Text>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        {formatDateTime(dispute.created_at)}
                      </Text>
                    </View>
                    <Chip
                      mode="flat"
                      compact
                      style={{ backgroundColor: getStatusColor(dispute.status) }}
                      textStyle={{ color: getStatusTextColor(dispute.status), fontSize: 11, fontWeight: '600' }}
                    >
                      {dispute.status}
                    </Chip>
                  </View>
                </Pressable>

                {isExpanded && (
                  <>
                    <Divider style={{ marginVertical: 12 }} />
                    
                    <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
                      Reason:
                    </Text>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 12 }}>
                      {dispute.reason}
                    </Text>

                    <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: '600' }}>
                      Disputed Items:
                    </Text>
                    {dispute.items?.map((item, idx) => {
                      const product = products[item.product_id];
                      return (
                        <View key={idx} style={styles.itemRow}>
                          <Text variant="bodyMedium" style={{ flex: 1 }}>
                            {product?.product_name || item.product_id}
                          </Text>
                          <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                            {item.quantity} x ${Number(product?.price || 0).toFixed(2)}
                          </Text>
                        </View>
                      );
                    })}

                    {dispute.resolution_notes && (
                      <>
                        <Divider style={{ marginVertical: 12 }} />
                        <Text variant="bodyMedium" style={{ marginBottom: 4, fontWeight: '600' }}>
                          Resolution Notes:
                        </Text>
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                          {dispute.resolution_notes}
                        </Text>
                      </>
                    )}

                    {dispute.status === 'PENDING' && (
                      <View style={styles.actionButtons}>
                        <Button
                          mode="contained"
                          onPress={() => showResolveDialog(dispute.dispute_id)}
                          style={{ flex: 1 }}
                        >
                          Resolve
                        </Button>
                      </View>
                    )}
                  </>
                )}
              </Surface>
            );
          })
        )}
      </ScrollView>

      <CustomDialog
        visible={resolveDialog.visible}
        title="Resolve Dispute"
        message="Enter resolution notes and choose action"
        onDismiss={hideResolveDialog}
        showInput
        inputProps={{
          placeholder: 'Resolution notes...',
          value: resolutionNotes,
          onChangeText: setResolutionNotes,
          multiline: true,
        }}
        customActions={
          <>
            <Button
              mode="contained"
              onPress={() => handleResolve('APPROVE')}
              disabled={resolving}
              loading={resolving}
              style={{ flex: 1 }}
            >
              Approve
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleResolve('REJECT')}
              disabled={resolving}
              style={{ flex: 1 }}
              textColor={paperTheme.colors.error}
            >
              Reject
            </Button>
          </>
        }
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 16,
  },
  disputeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionButtons: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
});
