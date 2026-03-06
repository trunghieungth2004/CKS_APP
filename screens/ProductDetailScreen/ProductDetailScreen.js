import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Button, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';

export default function ProductDetailScreen({ productId, onNavigate, onBack }) {
  const { paperTheme } = useTheme();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.PRODUCT.ONE, {
      productId: productId,
    });
    setLoading(false);

    if (result.success && result.data.data) {
      setProduct(result.data.data);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <StatusBar style="auto" />
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Product Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading product details...</Text>
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <StatusBar style="auto" />
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Product Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            Product not found
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
        <Appbar.Content title="Product Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Information */}
        <Surface style={styles.section} elevation={1}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Product Information</Text>
          
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Name:</Text>
            <Text variant="bodyMedium" style={{ fontWeight: '600', flex: 1, textAlign: 'right' }}>
              {product.product_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Description:</Text>
            <Text variant="bodyMedium" style={{ flex: 1, textAlign: 'right' }}>
              {product.product_description || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Price:</Text>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600' }}>
              ${Number(product.price).toFixed(2)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Shelf Life:</Text>
            <Text variant="bodyMedium">{product.shelf_life_days} days</Text>
          </View>

          <Button
            mode="contained"
            onPress={() => onNavigate('EditProduct', { product })}
            style={{ marginTop: 16 }}
            icon="pencil"
          >
            Edit Product Details
          </Button>
        </Surface>

        {/* Recipe Information */}
        {product.recipe && (
          <Surface style={styles.section} elevation={1}>
            <Text variant="titleLarge" style={styles.sectionTitle}>Recipe</Text>
            
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Recipe Name:</Text>
              <Text variant="bodyMedium" style={{ fontWeight: '600', flex: 1, textAlign: 'right' }}>
                {product.recipe.recipe_name}
              </Text>
            </View>

            <View style={styles.infoColumn}>
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 8 }}>
                Instructions:
              </Text>
              <Text variant="bodyMedium" style={{ lineHeight: 20 }}>
                {product.recipe.instructions}
              </Text>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>Ingredients</Text>
            
            {product.ingredients && product.ingredients.length > 0 ? (
              product.ingredients.map((ingredient, index) => (
                <View key={ingredient.ingredient_id} style={styles.ingredientCard}>
                  <View style={styles.ingredientInfo}>
                    <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                      {ingredient.material_name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                      {ingredient.quantity_per_unit} {ingredient.unit} per unit
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                No ingredients added
              </Text>
            )}

            <Button
              mode="contained-tonal"
              onPress={() => onNavigate('EditRecipe', { 
                recipe: product.recipe,
                ingredients: product.ingredients || [],
                productName: product.product_name
              })}
              style={{ marginTop: 16 }}
              icon="food-variant"
            >
              Edit Recipe & Ingredients
            </Button>
          </Surface>
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
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  infoColumn: {
    marginBottom: 12,
  },
  ingredientCard: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  ingredientInfo: {
    gap: 4,
  },
});
