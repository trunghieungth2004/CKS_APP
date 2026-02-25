import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../Icon/Icon';

const BottomNavigation = ({ currentTab, onTabChange, userRole }) => {
  const { theme } = useTheme();

  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border || !theme.colors.text) {
    return null;
  }

  // Get tabs based on user role
  const getTabsByRole = () => {
    switch (userRole) {
      case 4: // Store Staff
        return [
          { id: 'library', label: 'Orders', icon: 'orders' },
          { id: 'browse', label: 'Create', icon: 'add' },
          { id: 'history', label: 'Disputes', icon: 'dispute' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ];
      
      case 1: // CK Staff
        return [
          { id: 'library', label: 'QC', icon: 'quality' },
          { id: 'browse', label: 'Orders', icon: 'orders' },
          { id: 'history', label: 'History', icon: 'history' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ];
      
      case 2: // CK Supply
        return [
          { id: 'library', label: 'QC', icon: 'quality' },
          { id: 'browse', label: 'Dispatch', icon: 'truck' },
          { id: 'history', label: 'Orders', icon: 'orders' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ];
      
      case 3: // Manager
        return [
          { id: 'library', label: 'Disputes', icon: 'dispute' },
          { id: 'browse', label: 'Products', icon: 'manage' },
          { id: 'history', label: 'Orders', icon: 'orders' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ];
      
      case 0: // Admin
        return [
          { id: 'library', label: 'Dashboard', icon: 'dashboard' },
          { id: 'browse', label: 'Users', icon: 'users' },
          { id: 'history', label: 'Reports', icon: 'chart' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ];
      
      default:
        return [
          { id: 'library', label: 'Home', icon: 'home' },
          { id: 'browse', label: 'Browse', icon: 'search' },
          { id: 'history', label: 'History', icon: 'history' },
          { id: 'settings', label: 'Settings', icon: 'settings' },
        ];
    }
  };

  const tabs = getTabsByRole();

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border.light,
    }]}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.6}
          >
            <View style={[
              styles.iconContainer,
              isActive && {
                backgroundColor: theme.colors.primary + '15',
                borderRadius: 20,
              }
            ]}>
              <Icon 
                name={tab.icon} 
                size={24} 
                color={isActive ? theme.colors.primary : theme.colors.text.tertiary}
              />
            </View>
            <Text style={[
              styles.label,
              { 
                color: isActive ? theme.colors.primary : theme.colors.text.tertiary,
                fontWeight: isActive ? '600' : '500',
              }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.2,
  },
});

export default BottomNavigation;
