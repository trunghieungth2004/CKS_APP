import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Material Design icon component using React Native Vector Icons
const Icon = ({ name, size = 24, color, style }) => {
  const iconMap = {
    // Dashboard/Orders
    'dashboard': 'view-dashboard',
    'orders': 'clipboard-list',
    'cart': 'cart-plus',
    'box': 'package-variant',
    
    // QC/Quality
    'check': 'check-circle',
    'clipboard': 'clipboard-check',
    'quality': 'quality-high',
    
    // Dispatch/Delivery
    'truck': 'truck-delivery',
    'dispatch': 'send',
    'delivery': 'package-variant-closed',
    
    // Disputes/Issues
    'alert': 'alert',
    'dispute': 'alert-circle',
    'flag': 'flag',
    
    // Management
    'users': 'account-group',
    'settings': 'cog',
    'manage': 'folder-cog',
    'chart': 'chart-bar',
    
    // Navigation
    'home': 'home',
    'search': 'magnify',
    'history': 'history',
    'more': 'dots-horizontal',
    
    // Actions
    'add': 'plus',
    'edit': 'pencil',
    'delete': 'delete',
    'back': 'arrow-left',
    'forward': 'arrow-right',
  };

  const iconName = iconMap[name] || 'help-circle';

  return (
    <MaterialCommunityIcons 
      name={iconName} 
      size={size} 
      color={color} 
      style={style}
    />
  );
};

export default Icon;
