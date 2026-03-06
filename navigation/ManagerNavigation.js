import React from 'react';
import {
  ProductsManagementScreen,
  ProductDetailScreen,
  EditProductScreen,
  CreateProductScreen,
  RecipesManagementScreen,
  RecipeDetailScreen,
  EditRecipeScreen,
  CreateRecipeScreen,
  ManagerOrdersScreen,
  OrderDetailScreen,
  DisputesScreen,
  SettingsScreen,
} from '../screens';

export const ManagerNavigation = ({ 
  currentTab,
  currentScreen,
  screenParams,
  ordersInitialStatus,
  user,
  onNavigate,
  onBack,
  onStatusChange,
  onLogout,
}) => {
  // Handle product management screens
  if (currentScreen === 'ProductDetail' && screenParams.productId) {
    return (
      <ProductDetailScreen 
        productId={screenParams.productId}
        onBack={onBack}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentScreen === 'EditProduct' && screenParams.product) {
    return (
      <EditProductScreen 
        product={screenParams.product}
        onBack={onBack}
        onUpdated={() => {
          // Refresh will happen when going back
        }}
      />
    );
  }

  if (currentScreen === 'CreateProduct') {
    return (
      <CreateProductScreen 
        onBack={onBack}
        onCreated={() => {
          // Refresh will happen when going back
        }}
      />
    );
  }

  // Handle recipe management screens
  if (currentScreen === 'RecipeDetail' && screenParams.recipeId) {
    return (
      <RecipeDetailScreen 
        recipeId={screenParams.recipeId}
        onBack={onBack}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentScreen === 'EditRecipe' && screenParams.recipe) {
    return (
      <EditRecipeScreen 
        recipe={screenParams.recipe}
        ingredients={screenParams.ingredients}
        productName={screenParams.productName}
        onBack={onBack}
        onUpdated={() => {
          // Refresh will happen when going back
        }}
      />
    );
  }

  if (currentScreen === 'CreateRecipe') {
    return (
      <CreateRecipeScreen 
        onBack={onBack}
        onCreated={() => {
          // Refresh will happen when going back
        }}
      />
    );
  }

  if (currentScreen === 'ManagerOrderDetail' && screenParams.orderId) {
    return (
      <OrderDetailScreen 
        orderId={screenParams.orderId} 
        onBack={onBack}
        onNavigate={onNavigate}
        onNavigateTab={(status) => {
          onStatusChange(status);
          onBack();
        }}
      />
    );
  }

  switch (currentTab) {
    case 'products':
      return <ProductsManagementScreen onNavigate={onNavigate} />;
    case 'orders':
      return (
        <ManagerOrdersScreen 
          onNavigate={onNavigate}
          initialStatus={ordersInitialStatus}
          onStatusChange={(status) => onStatusChange(status)}
        />
      );
    case 'disputes':
      return <DisputesScreen onNavigate={onNavigate} />;
    case 'recipes':
      return <RecipesManagementScreen onNavigate={onNavigate} />;
    case 'settings':
      return <SettingsScreen user={user} storeInfo={null} onLogout={onLogout} />;
    default:
      return <ProductsManagementScreen onNavigate={onNavigate} />;
  }
};

export const MANAGER_TABS = [
  { key: 'products', title: 'Products', icon: 'package-variant' },
  { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
  { key: 'disputes', title: 'Disputes', icon: 'alert-circle' },
  { key: 'recipes', title: 'Recipes', icon: 'food-variant' },
  { key: 'settings', title: 'Settings', icon: 'cog' },
];
