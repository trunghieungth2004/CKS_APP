import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, FAB, Searchbar, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';

export default function RecipesManagementScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    const result = await apiService.get(API_ENDPOINTS.RECIPE.ALL);
    setLoading(false);

    if (result.success && result.data.data) {
      setRecipes(result.data.data);
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.instructions?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Recipes Management" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search recipes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading recipes...</Text>
        </View>
      ) : filteredRecipes.length === 0 ? (
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            No recipes found
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.recipe_id}
              onPress={() => onNavigate('RecipeDetail', { recipeId: recipe.recipe_id })}
            >
              <Surface style={styles.recipeCard} elevation={1}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {recipe.recipe_name}
                </Text>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.primary, marginTop: 4, fontWeight: '600' }}>
                  {recipe.product_name}
                </Text>
                {recipe.instructions && (
                  <Text 
                    variant="bodySmall" 
                    style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8 }}
                    numberOfLines={2}
                  >
                    {recipe.instructions}
                  </Text>
                )}
                <Divider style={{ marginVertical: 12 }} />
                <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  {recipe.ingredients?.length || 0} ingredient(s)
                </Text>
              </Surface>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        onPress={() => onNavigate('CreateRecipe')}
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
  recipeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
