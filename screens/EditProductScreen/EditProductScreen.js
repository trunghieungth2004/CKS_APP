import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Appbar, TextInput, Button, HelperText } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import CustomDialog from '../../components/CustomDialog';

export default function EditProductScreen({ product, onBack, onUpdated }) {
  const { paperTheme } = useTheme();
  const [productName, setProductName] = useState(product.product_name);
  const [productDescription, setProductDescription] = useState(product.product_description || '');
  const [price, setPrice] = useState(product.price.toString());
  const [shelfLife, setShelfLife] = useState(product.shelf_life_days.toString());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successDialog, setSuccessDialog] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    const result = await apiService.put(API_ENDPOINTS.PRODUCT.ONE, {
      productId: product.product_id,
      product_name: productName.trim(),
      product_description: productDescription.trim(),
      price: parseFloat(price),
      shelf_life_days: parseInt(shelfLife),
    });
    setSaving(false);

    if (result.success) {
      setSuccessDialog(true);
    } else {
      setErrors({ general: result.error || 'Failed to update product' });
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    if (onUpdated) {
      onUpdated();
    }
    onBack();
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title="Edit Product" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="bodyLarge" style={{ marginBottom: 24, color: paperTheme.colors.onSurfaceVariant }}>
          Update the product details below
        </Text>

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
          numberOfLines={3}
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

        {errors.general && (
          <HelperText type="error" visible={!!errors.general} style={{ fontSize: 14 }}>
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
          Save Changes
        </Button>
      </ScrollView>

      <CustomDialog
        visible={successDialog}
        title="Success"
        content="Product updated successfully"
        onDismiss={handleSuccessClose}
        actions={[
          {
            label: 'OK',
            onPress: handleSuccessClose,
          },
        ]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});
