import React from 'react';
import {
  CookedBatchQCScreen,
  CookedBatchDetailScreen,
  SupplyStaffOrdersScreen,
  SupplyOrderDetailScreen,
  SettingsScreen,
} from '../screens';

export const SupplyStaffNavigation = ({ 
  currentTab,
  currentScreen,
  screenParams,
  ordersInitialStatus,
  qcInitialTab,
  user,
  onNavigate,
  onBack,
  onStatusChange,
  onQcTabChange,
  onLogout,
}) => {
  // Handle special screens outside tab navigation
  if (currentScreen === 'CookedBatchDetail' && screenParams.batchId) {
    return (
      <CookedBatchDetailScreen 
        batchId={screenParams.batchId} 
        onBack={onBack}
        onNavigate={onNavigate}
      />
    );
  }

  // Handle both 'CKOrderDetail' and 'SupplyOrderDetail' for compatibility
  if ((currentScreen === 'SupplyOrderDetail' || currentScreen === 'CKOrderDetail') && screenParams.orderId) {
    return (
      <SupplyOrderDetailScreen 
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
    case 'qc':
      return (
        <CookedBatchQCScreen 
          onBack={null} 
          onNavigate={onNavigate}
          initialTab={qcInitialTab}
          onTabChange={onQcTabChange}
        />
      );
    case 'orders':
      return (
        <SupplyStaffOrdersScreen 
          onNavigate={onNavigate}
          initialStatus={ordersInitialStatus}
          onStatusChange={() => onStatusChange(null)}
        />
      );
    case 'settings':
      return <SettingsScreen user={user} storeInfo={null} onLogout={onLogout} />;
    default:
      return (
        <CookedBatchQCScreen 
          onBack={null} 
          onNavigate={onNavigate}
          initialTab={qcInitialTab}
          onTabChange={onQcTabChange}
        />
      );
  }
};

export const SUPPLY_STAFF_TABS = [
  { key: 'qc', title: 'QC', icon: 'clipboard-check' },
  { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
  { key: 'settings', title: 'Settings', icon: 'cog' },
];
