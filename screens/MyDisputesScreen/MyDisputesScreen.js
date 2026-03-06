import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Divider, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { formatDateTime } from '../../utils/validators';
import { DISPUTE_TYPE_LABELS } from '../../config/constants';

export default function MyDisputesScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [disputes, setDisputes] = useState([]);
  const [products, setProducts] = useState({});
  const [expandedDispute, setExpandedDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
              No disputes filed yet
            </Text>
          </View>
        ) : (
          disputes.map((dispute) => (
            <Pressable key={dispute.dispute_id} onPress={() => toggleExpand(dispute.dispute_id)}>
              <Surface style={styles.disputeCard} elevation={1}>
                <View style={styles.disputeHeader}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {dispute.order_id}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
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

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.itemsPreview}>
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, fontWeight: '600' }}>
                    {dispute.items.length} item{dispute.items.length > 1 ? 's' : ''} disputed
                  </Text>
                  {dispute.items.slice(0, 2).map((item, index) => (
                    <View key={index} style={styles.itemPreviewRow}>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        {products[item.product_id]?.product_name || 'Product'} - {DISPUTE_TYPE_LABELS[item.issue_type]} ({item.disputed_quantity} units)
                      </Text>
                    </View>
                  ))}
                  {dispute.items.length > 2 && (
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.primary, marginTop: 4 }}>
                      +{dispute.items.length - 2} more...
                    </Text>
                  )}
                </View>

                {expandedDispute === dispute.dispute_id && (
                  <>
                    <Divider style={{ marginVertical: 12 }} />
                    
                    <View style={styles.detailsSection}>
                      <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        Reason
                      </Text>
                      <View style={[styles.reasonBox, { backgroundColor: paperTheme.colors.surfaceVariant }]}>
                        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                          {dispute.reason}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        All Items
                      </Text>
                      {dispute.items.map((item, index) => (
                        <View key={index} style={styles.itemDetailRow}>
                          <View style={styles.itemDetailBullet} />
                          <View style={{ flex: 1 }}>
                            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                              {DISPUTE_TYPE_LABELS[item.issue_type]}
                            </Text>
                            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                              Product: {products[item.product_id]?.product_name || item.product_id}
                            </Text>
                            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                              Quantity: {item.disputed_quantity}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>

                    {dispute.status === 'RESOLVED' && dispute.resolution_notes && (
                      <View style={styles.detailsSection}>
                        <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                          Resolution
                        </Text>
                        <View
                          style={[styles.resolutionBox, { backgroundColor: paperTheme.colors.primaryContainer }]}
                        >
                          <Text variant="bodySmall" style={{ color: paperTheme.colors.onPrimaryContainer, marginBottom: 8 }}>
                            {dispute.resolution_notes}
                          </Text>
                          <Text variant="bodySmall" style={{ color: paperTheme.colors.onPrimaryContainer, opacity: 0.7 }}>
                            Resolved by: {dispute.resolved_by}
                          </Text>
                          <Text variant="bodySmall" style={{ color: paperTheme.colors.onPrimaryContainer, opacity: 0.7 }}>
                            Date: {formatDateTime(dispute.resolved_at)}
                          </Text>
                        </View>
                      </View>
                    )}

                    {onNavigate && (
                      <View style={styles.detailsSection}>
                        <Button
                          mode="contained"
                          icon="open-in-new"
                          onPress={(e) => {
                            e.stopPropagation();
                            onNavigate('OrderDetail', { orderId: dispute.order_id });
                          }}
                          style={{ borderRadius: 8 }}
                        >
                          View Order
                        </Button>
                      </View>
                    )}
                  </>
                )}

                <View style={styles.expandIndicator}>
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.primary, fontWeight: '600' }}>
                    {expandedDispute === dispute.dispute_id ? 'Tap to collapse' : 'Tap to expand'}
                  </Text>
                </View>
              </Surface>
            </Pressable>
          ))
        )}
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
    paddingBottom: 100,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 16,
  },
  disputeCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemsPreview: {
    gap: 4,
  },
  itemPreviewRow: {
    marginTop: 4,
  },
  detailsSection: {
    marginTop: 12,
  },
  reasonBox: {
    padding: 12,
    borderRadius: 8,
  },
  resolutionBox: {
    padding: 12,
    borderRadius: 8,
  },
  itemDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemDetailBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginTop: 6,
    marginRight: 12,
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 12,
  },
});
