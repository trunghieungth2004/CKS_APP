import React from 'react';
import {
  MyOrdersScreen,
  CreateOrderScreen,
  StoreInventoryScreen,
  DisputesScreen,
  SettingsScreen,
  OrderDetailScreen,
} from '../screens';

export const StoreStaffNavigation = ({ 
  currentTab, 
  currentScreen, 
  screenParams,
  ordersInitialStatus,
  storeInfo,
  user,
  onNavigate,
  onBack,
  onNavigateTab,
  onStatusChange,
  onLogout,
  onRefreshStoreInfo,
}) => {
  if (currentScreen === 'OrderDetail' && screenParams.orderId) {
    return (
      <OrderDetailScreen 
        orderId={screenParams.orderId} 
        onBack={onBack} 
        onNavigateTab={onNavigateTab} 
        onRefreshStoreInfo={onRefreshStoreInfo}
      />
    );
  }

  switch (currentTab) {
    case 'orders':
      return (
        <MyOrdersScreen 
          onNavigate={onNavigate} 
          initialStatus={ordersInitialStatus} 
          onStatusChange={() => onStatusChange(null)} 
          onRefreshStoreInfo={onRefreshStoreInfo}
        />
      );
    case 'create':
      return <CreateOrderScreen onNavigateTab={onNavigateTab} storeInfo={storeInfo} onRefreshStoreInfo={onRefreshStoreInfo} />;
    case 'inventory':
      return <StoreInventoryScreen />;
    case 'disputes':
      return <DisputesScreen onNavigate={onNavigate} />;
    case 'settings':
      return <SettingsScreen user={user} storeInfo={storeInfo} onLogout={onLogout} />;
    default:
      return (
        <MyOrdersScreen 
          onNavigate={onNavigate} 
          initialStatus={ordersInitialStatus} 
          onStatusChange={() => onStatusChange(null)} 
          onRefreshStoreInfo={onRefreshStoreInfo}
        />
      );
  }
};

export const STORE_STAFF_TABS = [
  { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
  { key: 'create', title: 'Create', icon: 'plus-circle' },
  { key: 'inventory', title: 'Inventory', icon: 'package-variant' },
  { key: 'disputes', title: 'Disputes', icon: 'alert-circle' },
  { key: 'settings', title: 'Settings', icon: 'cog' },
];
