import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Surface, Chip, Searchbar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { formatDateTime } from '../../utils/validators';

export default function RiskPoolInventory() {
  const { paperTheme } = useTheme();
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRiskPool();
  }, []);

  const loadRiskPool = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.INVENTORY.RISK_POOL);
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data && result.data.data.riskPoolTransfers) {
      const transferData = result.data.data.riskPoolTransfers;
      setTransfers(transferData);

      const productIds = [...new Set(transferData.map(t => t.product_id))];
      const productMap = {};
      
      for (const productId of productIds) {
        const productResult = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, { productId });
        if (productResult.success && productResult.data.data) {
          productMap[productId] = productResult.data.data;
        }
      }
      setProducts(productMap);
    } else {
      console.error('Failed to load risk pool:', result.message);
      setTransfers([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRiskPool();
  };

  const filteredTransfers = transfers.filter(transfer => {
    const product = products[transfer.product_id];
    const productName = product?.product_name || '';
    const transferId = transfer.transfer_id || '';
    const reason = transfer.reason || '';
    
    return productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           transferId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           reason.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Searchbar
        placeholder="Search transfers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[paperTheme.colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading risk pool transfers...</Text>
          </View>
        ) : filteredTransfers.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              {searchQuery ? 'No transfers found' : 'No risk pool transfers'}
            </Text>
          </View>
        ) : (
          filteredTransfers.map((transfer, index) => {
            const product = products[transfer.product_id];
            return (
              <Surface
                key={transfer.transfer_id || index}
                style={[styles.transferCard, { borderLeftColor: paperTheme.colors.primary }]}
                elevation={1}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.productInfo}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {product?.product_name || 'Loading...'}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Transfer ID: {transfer.transfer_id}
                    </Text>
                  </View>
                  <Chip 
                    mode="flat"
                    style={{ backgroundColor: paperTheme.colors.primaryContainer }}
                    textStyle={{ color: paperTheme.colors.onPrimaryContainer, fontWeight: 'bold' }}
                  >
                    +${transfer.credit_awarded.toFixed(2)}
                  </Chip>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Quantity Transferred
                    </Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                      {transfer.quantity}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Transfer Date
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {formatDateTime(transfer.transfer_date)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Transferred By
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {transfer.transferred_by}
                    </Text>
                  </View>

                  {transfer.reason && (
                    <View style={styles.reasonContainer}>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 4 }}>
                        Reason:
                      </Text>
                      <Text variant="bodyMedium" style={{ fontStyle: 'italic' }}>
                        {transfer.reason}
                      </Text>
                    </View>
                  )}
                </View>
              </Surface>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
  },
  transferCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasonContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
});
