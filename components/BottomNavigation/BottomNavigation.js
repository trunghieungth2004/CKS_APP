import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const BottomNavigation = ({ currentTab, onTabChange, userRole }) => {
  const { paperTheme } = useTheme();

  const getTabsByRole = () => {
    switch (userRole) {
      case 4:
        return [
          { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
          { key: 'create', title: 'Create', icon: 'plus-circle' },
          { key: 'inventory', title: 'Inventory', icon: 'package-variant' },
          { key: 'disputes', title: 'Disputes', icon: 'alert-circle' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 1:
        return [
          { key: 'qc', title: 'QC', icon: 'quality-high' },
          { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
          { key: 'history', title: 'History', icon: 'history' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 2:
        return [
          { key: 'qc', title: 'QC', icon: 'quality-high' },
          { key: 'dispatch', title: 'Dispatch', icon: 'truck-delivery' },
          { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 3:
        return [
          { key: 'disputes', title: 'Disputes', icon: 'alert-circle' },
          { key: 'products', title: 'Products', icon: 'folder-cog' },
          { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 0:
        return [
          { key: 'dashboard', title: 'Dashboard', icon: 'view-dashboard' },
          { key: 'users', title: 'Users', icon: 'account-group' },
          { key: 'reports', title: 'Reports', icon: 'chart-bar' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      default:
        return [
          { key: 'orders', title: 'Orders', icon: 'clipboard-list' },
          { key: 'create', title: 'Create', icon: 'plus-circle' },
          { key: 'disputes', title: 'Disputes', icon: 'alert-circle' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
    }
  };

  const tabs = getTabsByRole();

  return (
    <Surface style={[styles.container, { backgroundColor: paperTheme.colors.surface }]} elevation={3}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              isActive && {
                backgroundColor: paperTheme.colors.secondaryContainer,
                borderRadius: 24,
              }
            ]}>
              <MaterialCommunityIcons 
                name={tab.icon} 
                size={24} 
                color={isActive ? paperTheme.colors.onSecondaryContainer : paperTheme.colors.onSurfaceVariant}
              />
            </View>
            <Text 
              variant="labelSmall" 
              style={[
                styles.label,
                { color: isActive ? paperTheme.colors.onSurface : paperTheme.colors.onSurfaceVariant }
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: 100,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 4,
    minWidth: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default BottomNavigation;
