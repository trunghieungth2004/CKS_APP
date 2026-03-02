import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Searchbar, IconButton, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { formatDate, formatDateTime } from '../../utils/validators';

export default function InventoryScreen() {
  const { paperTheme } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailVisible, setProductDetailVisible] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    const result = await apiService.post('/api/inventory/store');
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data && result.data.data.inventory) {
      const products = result.data.data.inventory.filter(item => item.product_id);
      setInventory(products);
    } else {
      console.error('Failed to load inventory:', result.message);
      setInventory([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInventory();
  };

  const filteredInventory = inventory.filter(item => {
    const name = item.product_name || '';
    const id = item.product_id || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleProductPress = async (product) => {
    setSelectedProduct(product);
    setProductDetailVisible(true);
    setLoadingDetail(true);
    
    const result = await apiService.post('/api/product/one', { productId: product.product_id });
    
    if (result.success && result.data.data) {
      setProductDetail(result.data.data);
    } else {
      Alert.alert('Error', 'Failed to load product details');
    }
    setLoadingDetail(false);
  };

  const closeProductDetail = () => {
    setProductDetailVisible(false);
    setProductDetail(null);
    setSelectedProduct(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Store Inventory" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search inventory..."
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
            <Text variant="bodyLarge" style={styles.loadingText}>Loading inventory...</Text>
          </View>
        ) : filteredInventory.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              {searchQuery ? 'No items found' : 'No inventory items'}
            </Text>
          </View>
        ) : (
          filteredInventory.map((item, index) => (
            <TouchableOpacity
              key={item.inventory_id || index}
              onPress={() => handleProductPress(item)}
              activeOpacity={0.7}
            >
              <Surface
                style={styles.inventoryCard}
                elevation={1}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.productInfo}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                      {item.product_name}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      Quantity
                    </Text>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                      {item.quantity}
                    </Text>
                  </View>

                  {item.expiration_date && (
                    <View style={styles.infoRow}>
                      <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Expires
                      </Text>
                      <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                        {formatDate(item.expiration_date)}
                      </Text>
                    </View>
                  )}

                  {item.last_updated && (
                    <View style={styles.infoRow}>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        Last Updated
                      </Text>
                      <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        {formatDateTime(item.last_updated)}
                      </Text>
                    </View>
                  )}
                </View>
              </Surface>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={productDetailVisible}
        onRequestClose={closeProductDetail}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <Surface style={[styles.modalContent, { backgroundColor: paperTheme.colors.surface }]} elevation={5}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                Product Details
              </Text>
              <IconButton icon="close" onPress={closeProductDetail} />
            </View>

            <Divider />

            {loadingDetail ? (
              <View style={styles.modalLoading}>
                <ActivityIndicator size="large" />
              </View>
            ) : productDetail ? (
              <ScrollView style={styles.modalScroll}>
                <View style={styles.detailSection}>
                  <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    {productDetail.product_name}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 16 }}>
                    {productDetail.product_description}
                  </Text>

                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Price</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                      ${Number(productDetail.price).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Shelf Life</Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {productDetail.shelf_life_days} days
                    </Text>
                  </View>
                </View>

                {productDetail.recipe && (
                  <>
                    <Divider style={{ marginVertical: 16 }} />
                    <View style={styles.detailSection}>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                        Recipe
                      </Text>
                      <Text variant="bodyMedium" style={{ fontWeight: '600', marginBottom: 4 }}>
                        {productDetail.recipe.recipe_name}
                      </Text>
                      <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                        {productDetail.recipe.instructions}
                      </Text>
                    </View>
                  </>
                )}

                {productDetail.ingredients && productDetail.ingredients.length > 0 && (
                  <>
                    <Divider style={{ marginVertical: 16 }} />
                    <View style={styles.detailSection}>
                      <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
                        Ingredients ({productDetail.ingredients.length})
                      </Text>
                      {productDetail.ingredients.map((ingredient, index) => (
                        <View key={ingredient.ingredient_id} style={styles.ingredientItem}>
                          <Text variant="bodyMedium" style={{ flex: 1, fontWeight: '600' }}>
                            {ingredient.material_name}
                          </Text>
                          <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary }}>
                            {ingredient.quantity_per_unit} {ingredient.unit}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </ScrollView>
            ) : null}
          </Surface>
        </View>
      </Modal>
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
  inventoryCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingRight: 8,
  },
  modalLoading: {
    padding: 40,
    alignItems: 'center',
  },
  modalScroll: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
});
