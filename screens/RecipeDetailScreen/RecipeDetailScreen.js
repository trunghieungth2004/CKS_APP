import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Button, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';

export default function RecipeDetailScreen({ recipeId, onNavigate, onBack }) {
  const { paperTheme } = useTheme();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipeDetails();
  }, [recipeId]);

  const loadRecipeDetails = async () => {
    setLoading(true);
    const result = await apiService.post(API_ENDPOINTS.RECIPE.ONE, {
      recipe_id: recipeId,
    });
    setLoading(false);

    if (result.success && result.data.data) {
      setRecipe(result.data.data);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <StatusBar style="auto" />
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Recipe Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading recipe details...</Text>
        </View>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <StatusBar style="auto" />
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={onBack} />
          <Appbar.Content title="Recipe Details" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            Recipe not found
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
        <Appbar.Content title="Recipe Details" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Recipe Information */}
        <Surface style={styles.section} elevation={1}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Recipe Information</Text>
          
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Recipe Name:</Text>
            <Text variant="bodyMedium" style={{ fontWeight: '600', flex: 1, textAlign: 'right' }}>
              {recipe.recipe_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>Product:</Text>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, fontWeight: '600' }}>
              {recipe.product_name}
            </Text>
          </View>

          <View style={styles.infoColumn}>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Instructions:
            </Text>
            <Text variant="bodyMedium" style={{ lineHeight: 20 }}>
              {recipe.instructions}
            </Text>
          </View>
        </Surface>

        {/* Ingredients */}
        <Surface style={styles.section} elevation={1}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Ingredients</Text>
          
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            recipe.ingredients.map((ingredient, index) => (
              <View key={ingredient.ingredient_id} style={styles.ingredientCard}>
                <View style={styles.ingredientInfo}>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {ingredient.material_name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4 }}>
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
        </Surface>

        <Button
          mode="contained"
          onPress={() => onNavigate('EditRecipe', { 
            recipe: recipe,
            ingredients: recipe.ingredients || [],
            productName: recipe.product_name
          })}
          style={{ marginTop: 8 }}
          icon="pencil"
        >
          Edit Recipe
        </Button>
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
