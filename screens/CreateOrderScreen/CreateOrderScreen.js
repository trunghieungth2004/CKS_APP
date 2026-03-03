import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Searchbar, Chip, Button as PaperButton, IconButton, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { DatePickerModal } from 'react-native-paper-dates';
import { useTheme } from '../../context/ThemeContext';
import { Button, CustomDialog } from '../../components';
import apiService from '../../services/apiService';

import { en, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en', en);

export default function CreateOrderScreen({ onNavigateTab, storeInfo, onRefreshStoreInfo }) {
  const { paperTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [creditsToUse, setCreditsToUse] = useState('');
  const [addedItems, setAddedItems] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailVisible, setProductDetailVisible] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [dialog, setDialog] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: null, showCancel: false });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await apiService.get('/api/product/all');
    setLoading(false);

    if (result.success && result.data.data) {
      setProducts(result.data.data);
    } else {
      setDialog({ visible: true, title: 'Error', message: 'Failed to load products', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.product_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (productId) => {
    setAddedItems(prev => ({
      ...prev,
      [productId]: { quantity: 1, visible: true }
    }));
  };

  const handleRemoveProduct = (productId) => {
    setAddedItems(prev => {
      const newItems = { ...prev };
      delete newItems[productId];
      return newItems;
    });
  };

  const updateQuantity = (productId, value) => {
    const num = parseInt(value) || 0;
    if (num <= 0) {
      handleRemoveProduct(productId);
    } else {
      setAddedItems(prev => ({
        ...prev,
        [productId]: { ...prev[productId], quantity: num }
      }));
    }
  };

  const incrementQuantity = (productId) => {
    setAddedItems(prev => ({
      ...prev,
      [productId]: { ...prev[productId], quantity: (prev[productId]?.quantity || 0) + 1 }
    }));
  };

  const decrementQuantity = (productId) => {
    const currentQty = addedItems[productId]?.quantity || 0;
    if (currentQty <= 1) {
      handleRemoveProduct(productId);
    } else {
      setAddedItems(prev => ({
        ...prev,
        [productId]: { ...prev[productId], quantity: currentQty - 1 }
      }));
    }
  };

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

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateOrderTotal = () => {
    return Object.entries(addedItems).reduce((total, [productId, data]) => {
      const product = products.find(p => p.product_id === productId);
      return total + (product ? Number(product.price) * data.quantity : 0);
    }, 0);
  };

  const calculateAmountToPay = () => {
    const total = calculateOrderTotal();
    const credits = parseFloat(creditsToUse) || 0;
    return Math.max(0, total - credits);
  };

  const handleSubmit = async () => {
    const items = Object.entries(addedItems).map(([productId, data]) => ({
      product_id: productId,
      quantity: data.quantity
    }));

    if (items.length === 0) {
      setDialog({ visible: true, title: 'Validation Error', message: 'Please add at least one item', type: 'warning', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
      return;
    }

    if (!deliveryDate) {
      setDialog({ visible: true, title: 'Validation Error', message: 'Please select a delivery date', type: 'warning', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
      return;
    }

    const creditsValue = parseFloat(creditsToUse) || 0;
    if (creditsValue < 0) {
      setDialog({ visible: true, title: 'Validation Error', message: 'Credits cannot be negative', type: 'warning', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
      return;
    }

    const availableCredits = storeInfo?.totalCredits || 0;
    if (creditsValue > availableCredits) {
      setDialog({ visible: true, title: 'Validation Error', message: `Credits exceed available balance ($${availableCredits.toFixed(2)})`, type: 'warning', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
      return;
    }

    const orderTotal = items.reduce((total, item) => {
      const product = products.find(p => p.product_id === item.product_id);
      return total + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    if (creditsValue > orderTotal) {
      setDialog({ visible: true, title: 'Validation Error', message: `Credits ($${creditsValue.toFixed(2)}) cannot exceed order total ($${orderTotal.toFixed(2)})`, type: 'warning', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
      return;
    }

    setSubmitting(true);

    const orderData = {
      delivery_date: deliveryDate.toISOString(),
      items: items,
      notes: notes || undefined,
    };

    if (creditsValue > 0) {
      orderData.credits_to_use = parseFloat(creditsValue.toFixed(2));
    }

    const result = await apiService.post('/api/order/create', orderData);

    setSubmitting(false);

    if (result.success) {
      if (onRefreshStoreInfo) {
        await onRefreshStoreInfo();
      }
      setDialog({ 
        visible: true, 
        title: 'Success', 
        message: 'Order created successfully', 
        type: 'success', 
        onConfirm: () => {
          setDialog({ ...dialog, visible: false });
          setAddedItems({});
          setDeliveryDate(null);
          setNotes('');
          setCreditsToUse('');
          if (onNavigateTab) {
            onNavigateTab('orders', 'OR100');
          }
        }, 
        showCancel: false 
      });
    } else {
      setDialog({ visible: true, title: 'Error', message: result.message || 'Failed to create order', type: 'error', onConfirm: () => setDialog({ ...dialog, visible: false }), showCancel: false });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Create Order" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.orderDetails}>
        <View style={styles.dateNotesRow}>
          <TouchableOpacity
            onPress={() => setDatePickerOpen(true)}
            style={[styles.dateInput, { 
              backgroundColor: paperTheme.colors.surface,
              borderColor: paperTheme.colors.outline,
              flex: 1,
            }]}
          >
            <Text variant="bodyMedium" style={{ color: deliveryDate ? paperTheme.colors.onSurface : paperTheme.colors.onSurfaceVariant }}>
              {deliveryDate ? formatDate(deliveryDate) : 'Delivery Date'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { 
              backgroundColor: paperTheme.colors.surface,
              color: paperTheme.colors.onSurface,
              borderColor: paperTheme.colors.outline,
              flex: 1,
              minHeight: 40,
              fontSize: 14,
            }]}
            placeholder="Notes (Optional)"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <DatePickerModal
          locale="en"
          mode="single"
          visible={datePickerOpen}
          onDismiss={() => setDatePickerOpen(false)}
          date={deliveryDate}
          onConfirm={({ date }) => {
            setDeliveryDate(date);
            setDatePickerOpen(false);
          }}
          validRange={{
            startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          }}
        />
        {storeInfo && storeInfo.totalCredits > 0 && (
          <View style={styles.creditsContainer}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 4 }}>
              Available Credits: ${(storeInfo.totalCredits || 0).toFixed(2)}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: paperTheme.colors.surface,
                color: paperTheme.colors.onSurface,
                borderColor: paperTheme.colors.outline
              }]}
              placeholder="Credits to use (Optional)"
              placeholderTextColor={paperTheme.colors.onSurfaceVariant}
              value={creditsToUse}
              onChangeText={setCreditsToUse}
              keyboardType="decimal-pad"
            />
          </View>
        )}
      </View>

      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          filteredProducts.map(product => {
            const isAdded = addedItems[product.product_id];
            return (
              <Surface key={product.product_id} style={styles.productCard} elevation={1}>
                <View style={styles.productCardContent}>
                  <TouchableOpacity
                    onPress={() => handleProductPress(product)}
                    activeOpacity={0.7}
                    style={styles.productInfo}
                  >
                    <Text variant="titleMedium" style={styles.productName}>
                      {product.product_name}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      {product.product_description}
                    </Text>
                    <Text variant="bodyLarge" style={{ color: paperTheme.colors.primary, fontWeight: 'bold', marginTop: 4 }}>
                      ${Number(product.price).toFixed(2)}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.productActions}>
                    {!isAdded ? (
                      <IconButton
                        icon="plus"
                        mode="contained"
                        onPress={() => handleAddProduct(product.product_id)}
                        iconColor={paperTheme.colors.onPrimary}
                        containerColor={paperTheme.colors.primary}
                        size={20}
                      />
                    ) : (
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: paperTheme.colors.errorContainer }]}
                        onPress={() => decrementQuantity(product.product_id)}
                      >
                        <Text style={{ fontSize: 20, color: paperTheme.colors.onErrorContainer }}>−</Text>
                      </TouchableOpacity>
                      
                      <TextInput
                        style={[styles.quantityInput, { 
                          backgroundColor: paperTheme.colors.surface,
                          color: paperTheme.colors.onSurface,
                          borderColor: paperTheme.colors.outline
                        }]}
                        value={String(isAdded.quantity)}
                        onChangeText={(val) => updateQuantity(product.product_id, val)}
                        keyboardType="number-pad"
                        selectTextOnFocus
                      />
                      
                      <TouchableOpacity 
                        style={[styles.controlButton, { backgroundColor: paperTheme.colors.primaryContainer }]}
                        onPress={() => incrementQuantity(product.product_id)}
                      >
                        <Text style={{ fontSize: 20, color: paperTheme.colors.onPrimaryContainer }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  </View>
                </View>
              </Surface>
            );
          })
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

      <Surface style={styles.footer} elevation={4}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              Total Items:
            </Text>
            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
              {Object.keys(addedItems).length}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              Order Total:
            </Text>
            <Text variant="bodyLarge" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
              ${calculateOrderTotal().toFixed(2)}
            </Text>
          </View>
          {creditsToUse && parseFloat(creditsToUse) > 0 && (
            <>
              <View style={styles.summaryRow}>
                <Text variant="bodySmall" style={{ color: paperTheme.colors.tertiary }}>
                  Credits Applied:
                </Text>
                <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.tertiary }}>
                  -${parseFloat(creditsToUse).toFixed(2)}
                </Text>
              </View>
              <View style={[styles.summaryRow, { paddingTop: 4, borderTopWidth: 1, borderTopColor: paperTheme.colors.outlineVariant }]}>
                <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                  Amount to Pay:
                </Text>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: paperTheme.colors.primary }}>
                  ${calculateAmountToPay().toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </View>
        <PaperButton 
          mode="contained" 
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || Object.keys(addedItems).length === 0}
          style={styles.submitButton}
        >
          Place Order
        </PaperButton>
      </Surface>

      <CustomDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onDismiss={() => setDialog({ ...dialog, visible: false })}
        onConfirm={dialog.onConfirm}
        showCancel={dialog.showCancel}
      />

      {(submitting || dialog.visible) && (
        <View style={styles.backdrop} pointerEvents={submitting ? 'auto' : 'none'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderDetails: {
    padding: 16,
    gap: 12,
  },
  dateNotesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  creditsContainer: {
    marginTop: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 16,
  },
  productCard: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  productCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  submitButton: {
    width: '100%',
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
