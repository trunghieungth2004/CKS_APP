import React from 'react';
import {
  RawMaterialQCScreen,
  CKInventoryScreen,
  CKOrdersScreen,
  CKOrderDetailScreen,
  SettingsScreen,
} from '../screens';

export const CKStaffNavigation = ({ 
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
  // Handle special screens outside tab navigation
  if (currentScreen === 'CKOrderDetail' && screenParams.orderId) {
    return (
      <CKOrderDetailScreen 
        orderId={screenParams.orderId} 
        onBack={onBack} 
        onNavigateTab={(status) => {
          onStatusChange(status);
          onBack();
        }}
      />
    );
  }

  switch (currentTab) {
    case 'qc':
      return <RawMaterialQCScreen onBack={null} />;
    case 'orders':
      return (
        <CKOrdersScreen 
          onNavigate={onNavigate}
          initialStatus={ordersInitialStatus}
          onStatusChange={() => onStatusChange(null)}
        />
      );
    case 'inventory':
      return <CKInventoryScreen onBack={null} />;
    case 'settings':
      return <SettingsScreen user={user} storeInfo={null} onLogout={onLogout} />;
    default:
      return <RawMaterialQCScreen onBack={null} />;
  }
};

export const CK_STAFF_TABS = [
  { key: 'qc', title: 'QC', icon: 'clipboard-check' },
  { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
  { key: 'inventory', title: 'Inventory', icon: 'package-variant' },
  { key: 'settings', title: 'Settings', icon: 'cog' },
];
