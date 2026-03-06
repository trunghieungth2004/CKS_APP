import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from 'react-native';
import { Text, Appbar, TextInput, Button, HelperText, Surface, IconButton, Menu, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import CustomDialog from '../../components/CustomDialog';

export default function CreateProductScreen({ onBack, onCreated }) {
  const { paperTheme } = useTheme();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [shelfLife, setShelfLife] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successDialog, setSuccessDialog] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);

  useEffect(() => {
    loadRawMaterials();
  }, []);

  const loadRawMaterials = async () => {
    setLoadingMaterials(true);
    const result = await apiService.get(API_ENDPOINTS.RAW_MATERIAL.ALL);
    setLoadingMaterials(false);

    if (result.success && result.data.data) {
      setRawMaterials(result.data.data);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Valid price is required';
    }

    const shelfLifeNum = parseInt(shelfLife);
    if (!shelfLife || isNaN(shelfLifeNum) || shelfLifeNum <= 0) {
      newErrors.shelfLife = 'Valid shelf life is required';
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
    const result = await apiService.post(API_ENDPOINTS.PRODUCT.CREATE, {
      product_name: productName.trim(),
      product_description: productDescription.trim(),
      price: parseFloat(price),
      shelf_life_days: parseInt(shelfLife),
      recipe: {
        recipe_name: recipeName.trim(),
        instructions: instructions.trim(),
      },
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
      setErrors({ general: result.error || 'Failed to create product' });
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
        <Appbar.Content title="Create Product" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ marginBottom: 24, color: paperTheme.colors.onSurfaceVariant }}>
          Create a new product with recipe and ingredients
        </Text>

        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>Product Details</Text>

        <TextInput
          label="Product Name *"
          value={productName}
          onChangeText={(text) => {
            setProductName(text);
            if (errors.productName) {
              setErrors({ ...errors, productName: null });
            }
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.productName}
        />
        {errors.productName && (
          <HelperText type="error" visible={!!errors.productName}>
            {errors.productName}
          </HelperText>
        )}

        <TextInput
          label="Product Description"
          value={productDescription}
          onChangeText={setProductDescription}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />

        <TextInput
          label="Price ($) *"
          value={price}
          onChangeText={(text) => {
            setPrice(text);
            if (errors.price) {
              setErrors({ ...errors, price: null });
            }
          }}
          mode="outlined"
          keyboardType="decimal-pad"
          style={styles.input}
          error={!!errors.price}
        />
        {errors.price && (
          <HelperText type="error" visible={!!errors.price}>
            {errors.price}
          </HelperText>
        )}

        <TextInput
          label="Shelf Life (days) *"
          value={shelfLife}
          onChangeText={(text) => {
            setShelfLife(text);
            if (errors.shelfLife) {
              setErrors({ ...errors, shelfLife: null });
            }
          }}
          mode="outlined"
          keyboardType="number-pad"
          style={styles.input}
          error={!!errors.shelfLife}
        />
        {errors.shelfLife && (
          <HelperText type="error" visible={!!errors.shelfLife}>
            {errors.shelfLife}
          </HelperText>
        )}

        <Divider style={{ marginVertical: 24 }} />

        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>Recipe</Text>

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
            onPress={() => setMaterialModalVisible(true)}
            icon="plus"
            disabled={loadingMaterials || getAvailableMaterials().length === 0}
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
          Create Product
        </Button>
      </ScrollView>

      <CustomDialog
        visible={successDialog}
        title="Success"
        content="Product created successfully"
        onDismiss={handleSuccessClose}
        actions={[
          {
            label: 'OK',
            onPress: handleSuccessClose,
          },
        ]}
      />

      {/* Material Selection Modal */}
      <Modal
        visible={materialModalVisible}
        onRequestClose={() => setMaterialModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: paperTheme.colors.background }]}>
          <Appbar.Header elevated>
            <Appbar.BackAction onPress={() => setMaterialModalVisible(false)} />
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
                    setMaterialModalVisible(false);
                  }}
                >
                  <Surface style={styles.materialModalCard} elevation={1}>
                    <View style={styles.materialModalHeader}>
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
                    
                    <View style={styles.materialModalDetails}>
                      <View style={styles.materialModalDetailItem}>
                        <Text variant="labelSmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>Unit</Text>
                        <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                          {material.unit}
                        </Text>
                      </View>
                      <View style={styles.materialModalDetailItem}>
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
  materialModalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  materialModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  materialModalDetails: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 24,
  },
  materialModalDetailItem: {
    gap: 4,
  },
});
