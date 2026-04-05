import React from 'react';
import {
  UserManagementScreen,   
  SettingsScreen,
} from '../screens';

export const AdminNavigation = ({
  currentTab,
  currentScreen,
  screenParams,
  user,
  onNavigate,
  onBack,
  onLogout,
}) => {

  if (currentScreen === 'UserDetail' && screenParams.userId) {
    return (
      <UserManagementScreen
        userId={screenParams.userId}
        onBack={onBack}
      />
    );
  }

  switch (currentTab) {
    case 'users':
      return <UserManagementScreen onNavigate={onNavigate} />;
    case 'settings':
      return <SettingsScreen user={user} storeInfo={null} onLogout={onLogout} />;
    default:
      return <UserManagementScreen onNavigate={onNavigate} />;
  }
};

export const ADMIN_TABS = [
  { key: 'users', title: 'Users', icon: 'account-group' },
  { key: 'settings', title: 'Settings', icon: 'cog' },
];
