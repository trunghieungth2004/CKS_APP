import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Button, FAB, Searchbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';

export default function ProductsManagementScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const result = await apiService.get(API_ENDPOINTS.PRODUCT.ALL);
    setLoading(false);

    if (result.success && result.data.data) {
      setProducts(result.data.data);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.product_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Products Management" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            No products found
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredProducts.map((product) => (
            <TouchableOpacity 
              key={product.product_id}
              onPress={() => onNavigate('ProductDetail', { productId: product.product_id })}
            >
              <Surface style={styles.productCard} elevation={1}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {product.product_name}
                </Text>
                {product.product_description && (
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
                    {product.product_description}
                  </Text>
                )}
                <View style={styles.productDetails}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600', marginTop: 8 }}>
                    ${Number(product.price).toFixed(2)}
                  </Text>
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8 }}>
                    {product.shelf_life_days} days shelf life
                  </Text>
                </View>
              </Surface>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        onPress={() => onNavigate('CreateProduct')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  productCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
