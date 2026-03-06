import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from 'react-native';
import { Text, Appbar, TextInput, Button, HelperText, Surface, IconButton, Menu, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import CustomDialog from '../../components/CustomDialog';

export default function CreateRecipeScreen({ onBack, onCreated }) {
  const { paperTheme } = useTheme();
  const [recipeName, setRecipeName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successDialog, setSuccessDialog] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const [productsResult, materialsResult] = await Promise.all([
      apiService.get(API_ENDPOINTS.PRODUCT.ALL),
      apiService.get(API_ENDPOINTS.RAW_MATERIAL.ALL),
    ]);
    setLoadingData(false);

    if (productsResult.success && productsResult.data.data) {
      setProducts(productsResult.data.data);
    }
    if (materialsResult.success && materialsResult.data.data) {
      setRawMaterials(materialsResult.data.data);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedProduct) {
      newErrors.product = 'Product is required';
    }

    if (!recipeName.trim()) {
      newErrors.recipeName = 'Recipe name is required';
    }

    if (!instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }

    if (ingredients.length === 0) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    ingredients.forEach((ing, index) => {
      const qty = parseFloat(ing.quantity_per_unit);
      if (!ing.quantity_per_unit || isNaN(qty) || qty <= 0) {
        newErrors[`ingredient_${index}`] = 'Valid quantity is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    const result = await apiService.post(API_ENDPOINTS.RECIPE.CREATE, {
      product_id: selectedProduct.product_id,
      recipe_name: recipeName.trim(),
      instructions: instructions.trim(),
      ingredients: ingredients.map(ing => ({
        material_id: ing.material_id,
        material_name: ing.material_name,
        quantity_per_unit: parseFloat(ing.quantity_per_unit),
        unit: ing.unit,
      })),
    });
    setSaving(false);

    if (result.success) {
      setSuccessDialog(true);
    } else {
      setErrors({ general: result.error || 'Failed to create recipe' });
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    if (onCreated) {
      onCreated();
    }
    onBack();
  };

  const handleAddIngredient = (material) => {
    setIngredients([
      ...ingredients,
      {
        material_id: material.material_id,
        material_name: material.material_name,
        quantity_per_unit: '0',
        unit: material.unit,
      },
    ]);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, value) => {
    const updated = [...ingredients];
    updated[index].quantity_per_unit = value;
    setIngredients(updated);
    if (errors[`ingredient_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`ingredient_${index}`];
      setErrors(newErrors);
    }
  };

  const getAvailableMaterials = () => {
    const usedMaterialIds = ingredients.map(ing => ing.material_id);
    return rawMaterials.filter(mat => !usedMaterialIds.includes(mat.material_id));
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title="Create Recipe" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ marginBottom: 24, color: paperTheme.colors.onSurfaceVariant }}>
          Create a new recipe for a product
        </Text>

        {/* Product Selection */}
        <Text variant="labelLarge" style={{ marginBottom: 8 }}>Select Product *</Text>
        <Button
          mode="outlined"
          onPress={() => setProductModalVisible(true)}
          disabled={loadingData}
          style={styles.input}
          contentStyle={{ justifyContent: 'flex-start' }}
          icon="package-variant"
        >
          {selectedProduct ? selectedProduct.product_name : 'Select a product'}
        </Button>
        {errors.product && (
          <HelperText type="error" visible={!!errors.product}>
            {errors.product}
          </HelperText>
        )}

        <TextInput
          label="Recipe Name *"
          value={recipeName}
          onChangeText={(text) => {
            setRecipeName(text);
            if (errors.recipeName) {
              setErrors({ ...errors, recipeName: null });
            }
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.recipeName}
        />
        {errors.recipeName && (
          <HelperText type="error" visible={!!errors.recipeName}>
            {errors.recipeName}
          </HelperText>
        )}

        <TextInput
          label="Instructions *"
          value={instructions}
          onChangeText={(text) => {
            setInstructions(text);
            if (errors.instructions) {
              setErrors({ ...errors, instructions: null });
            }
          }}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          error={!!errors.instructions}
        />
        {errors.instructions && (
          <HelperText type="error" visible={!!errors.instructions}>
            {errors.instructions}
          </HelperText>
        )}

        <Divider style={{ marginVertical: 16 }} />

        <View style={styles.ingredientsHeader}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Ingredients *</Text>
          <Button
            mode="contained-tonal"
            onPress={() => setIngredientModalVisible(true)}
            icon="plus"
            disabled={loadingData || getAvailableMaterials().length === 0}
          >
            Add Ingredient
          </Button>
        </View>

        {errors.ingredients && (
          <HelperText type="error" visible={!!errors.ingredients}>
            {errors.ingredients}
          </HelperText>
        )}

        {ingredients.length === 0 ? (
          <Surface style={styles.emptyState}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, textAlign: 'center' }}>
              No ingredients added. Click "Add Ingredient" to get started.
            </Text>
          </Surface>
        ) : (
          ingredients.map((ingredient, index) => (
            <Surface key={index} style={styles.ingredientCard} elevation={1}>
              <View style={styles.ingredientHeader}>
                <Text variant="titleSmall" style={{ fontWeight: '600', flex: 1 }}>
                  {ingredient.material_name}
                </Text>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleRemoveIngredient(index)}
                  iconColor={paperTheme.colors.error}
                />
              </View>
              <View style={styles.ingredientQuantity}>
                <TextInput
                  label={`Quantity per unit (${ingredient.unit})`}
                  value={ingredient.quantity_per_unit}
                  onChangeText={(value) => handleUpdateQuantity(index, value)}
                  mode="outlined"
                  keyboardType="decimal-pad"
                  style={{ flex: 1 }}
                  error={!!errors[`ingredient_${index}`]}
                  dense
                />
              </View>
              {errors[`ingredient_${index}`] && (
                <HelperText type="error" visible={!!errors[`ingredient_${index}`]}>
                  {errors[`ingredient_${index}`]}
                </HelperText>
              )}
            </Surface>
          ))
        )}

        {errors.general && (
          <HelperText type="error" visible={!!errors.general} style={{ fontSize: 14, marginTop: 16 }}>
            {errors.general}
          </HelperText>
        )}

        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveButton}
          icon="content-save"
        >
          Create Recipe
        </Button>
      </ScrollView>

      <CustomDialog
        visible={successDialog}
        title="Success"
        content="Recipe created successfully"
        onDismiss={handleSuccessClose}
        actions={[
          {
            label: 'OK',
            onPress: handleSuccessClose,
          },
        ]}
      />

      {/* Product Selection Modal */}
      <Modal
        visible={productModalVisible}
        onRequestClose={() => setProductModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: paperTheme.colors.background }]}>
          <Appbar.Header elevated>
            <Appbar.BackAction onPress={() => setProductModalVisible(false)} />
            <Appbar.Content title="Select Product" />
          </Appbar.Header>
          
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {products.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant, textAlign: 'center' }}>
                  No products available
                </Text>
              </View>
            ) : (
              products.map((product) => (
                <TouchableOpacity
                  key={product.product_id}
                  onPress={() => {
                    setSelectedProduct(product);
                    setProductModalVisible(false);
                    if (errors.product) {
                      setErrors({ ...errors, product: null });
                    }
                  }}
                >
                  <Surface 
                    style={[
                      styles.productModalCard,
                      selectedProduct?.product_id === product.product_id && {
                        borderColor: paperTheme.colors.primary,
                        borderWidth: 2,
                      }
                    ]} 
                    elevation={1}
                  >
                    <View style={styles.productModalHeader}>
                      <Text variant="titleLarge" style={{ fontWeight: 'bold', flex: 1 }}>
                        {product.product_name}
                      </Text>
                      {selectedProduct?.product_id === product.product_id && (
                        <IconButton
                          icon="check-circle"
                          iconColor={paperTheme.colors.primary}
                          size={32}
                        />
                      )}
                    </View>
                    
                    {product.product_description && (
                      <Text 
                        variant="bodyMedium" 
                        style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}
                        numberOfLines={2}
                      >
                        {product.product_description}
                      </Text>
                    )}
                    
                    <View style={styles.productModalDetails}>
                      <View style={styles.productModalDetailItem}>
                        <Text variant="labelSmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>Price</Text>
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600' }}>
                          ${Number(product.price).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.productModalDetailItem}>
                        <Text variant="labelSmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>Shelf Life</Text>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          {product.shelf_life_days} days
                        </Text>
                      </View>
                    </View>
                  </Surface>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Ingredient Selection Modal */}
      <Modal
        visible={ingredientModalVisible}
        onRequestClose={() => setIngredientModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: paperTheme.colors.background }]}>
          <Appbar.Header elevated>
            <Appbar.BackAction onPress={() => setIngredientModalVisible(false)} />
            <Appbar.Content title="Select Ingredient" />
          </Appbar.Header>
          
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            {getAvailableMaterials().length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant, textAlign: 'center' }}>
                  No more materials available
                </Text>
              </View>
            ) : (
              getAvailableMaterials().map((material) => (
                <TouchableOpacity
                  key={material.material_id}
                  onPress={() => {
                    handleAddIngredient(material);
                    setIngredientModalVisible(false);
                  }}
                >
                  <Surface style={styles.productModalCard} elevation={1}>
                    <View style={styles.productModalHeader}>
                      <Text variant="titleLarge" style={{ fontWeight: 'bold', flex: 1 }}>
                        {material.material_name}
                      </Text>
                      <IconButton
                        icon="plus-circle"
                        iconColor={paperTheme.colors.primary}
                        size={32}
                      />
                    </View>
                    
                    {material.description && (
                      <Text 
                        variant="bodyMedium" 
                        style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}
                        numberOfLines={2}
                      >
                        {material.description}
                      </Text>
                    )}
                    
                    <View style={styles.productModalDetails}>
                      <View style={styles.productModalDetailItem}>
                        <Text variant="labelSmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>Unit</Text>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          {material.unit}
                        </Text>
                      </View>
                      <View style={styles.productModalDetailItem}>
                        <Text variant="labelSmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>Price</Text>
                        <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600' }}>
                          ${Number(material.price).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </Surface>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  input: {
    marginBottom: 8,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  ingredientCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 24,
  },
  modalContainer: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  productModalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  productModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productModalDetails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 24,
  },
  productModalDetailItem: {
    gap: 4,
  },
});
