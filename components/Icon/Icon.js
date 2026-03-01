import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Icon = ({ name, size = 24, color, style }) => {
  const iconMap = {
    'dashboard': 'view-dashboard',
    'orders': 'clipboard-list',
    'cart': 'cart-plus',
    'box': 'package-variant',
    
    'check': 'check-circle',
    'clipboard': 'clipboard-check',
    'quality': 'quality-high',
    
    'truck': 'truck-delivery',
    'dispatch': 'send',
    'delivery': 'package-variant-closed',
    
    'alert': 'alert',
    'dispute': 'alert-circle',
    'flag': 'flag',
    
    'users': 'account-group',
    'settings': 'cog',
    'manage': 'folder-cog',
    'chart': 'chart-bar',
    
    'home': 'home',
    'search': 'magnify',
    'history': 'history',
    'more': 'dots-horizontal',
    
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
