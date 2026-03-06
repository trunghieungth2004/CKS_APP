import React from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Text, Surface, Button, Divider, Appbar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/validators';

export default function RiskPoolModal({ 
  visible, 
  failedBatch, 
  riskPoolSearch, 
  transferring,
  onClose, 
  onSearch, 
  onTransfer 
}) {
  const { paperTheme } = useTheme();

  if (!failedBatch) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onClose} />
          <Appbar.Content title="Risk Pool Transfer" titleStyle={{ fontWeight: 'bold' }} />
        </Appbar.Header>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Surface style={[styles.headerCard, { backgroundColor: paperTheme.colors.surface }]} elevation={1}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 4 }}>
              Failed Batch
            </Text>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.primary, fontWeight: '600' }}>
              {failedBatch.batch_id}
            </Text>
          </Surface>
          
          {failedBatch.items?.map((item, idx) => (
            <Surface key={idx} style={[styles.productCard, { backgroundColor: paperTheme.colors.surface }]} elevation={1}>
              <View style={styles.productHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {item.product_name || item.product_id}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                    Quantity: {item.quantity} kg
                  </Text>
                </View>
              </View>
              
              <Button
                mode="contained"
                onPress={() => onSearch(item.product_id, item.quantity)}
                disabled={riskPoolSearch.loading}
                loading={riskPoolSearch.loading && riskPoolSearch.selectedProduct?.productId === item.product_id}
                style={{ marginTop: 12 }}
                icon="magnify"
              >
                Search Risk Pool
              </Button>
              
              {riskPoolSearch.selectedProduct?.productId === item.product_id && riskPoolSearch.results.length > 0 && (
                <View style={styles.resultsContainer}>
                  <Divider style={{ marginVertical: 16 }} />
                  <Text variant="titleSmall" style={{ fontWeight: 'bold', marginBottom: 12 }}>
                    Available Stores
                  </Text>
                  
                  {riskPoolSearch.results.map((store, storeIdx) => (
                    <Surface key={storeIdx} style={[styles.storeCard, { backgroundColor: paperTheme.colors.surfaceVariant }]} elevation={0}>
                      <View style={styles.storeInfo}>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          Store: {store.store_staff_id}
                        </Text>
                        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                          Available: {store.available_quantity} kg
                        </Text>
                        <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                          Expiry: {formatDate(store.expiration_date) || 'N/A'}
                        </Text>
                        {store.potential_credit > 0 && (
                          <Text variant="bodySmall" style={{ color: paperTheme.colors.primary, fontWeight: '600', marginTop: 4 }}>
                            Credit: ${store.potential_credit.toFixed(2)}
                          </Text>
                        )}
                      </View>
                      
                      <Button
                        mode={store.can_fulfill ? 'contained' : 'outlined'}
                        onPress={() => onTransfer(store)}
                        disabled={!store.can_fulfill || transferring !== null}
                        loading={transferring === store.store_staff_id}
                        style={{ marginTop: 8 }}
                      >
                        {store.can_fulfill ? 'Transfer' : 'Insufficient'}
                      </Button>
                    </Surface>
                  ))}
                </View>
              )}
              
              {riskPoolSearch.selectedProduct?.productId === item.product_id && !riskPoolSearch.loading && riskPoolSearch.results.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.error, fontStyle: 'italic' }}>
                    No available stores found
                  </Text>
                </View>
              )}
            </Surface>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  productCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultsContainer: {
    marginTop: 8,
  },
  storeCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  storeInfo: {
    marginBottom: 4,
  },
  noResultsContainer: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
  },
});
