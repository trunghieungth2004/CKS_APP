import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const BottomNavigation = ({ currentTab, onTabChange, userRole }) => {
  const { paperTheme } = useTheme();

  // Get tabs based on user role
  const getTabsByRole = () => {
    switch (userRole) {
      case 4: // Store Staff
        return [
          { key: 'library', title: 'Orders', icon: 'clipboard-list' },
          { key: 'browse', title: 'Create', icon: 'plus-circle' },
          { key: 'history', title: 'Disputes', icon: 'alert-circle' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 1: // CK Staff
        return [
          { key: 'library', title: 'QC', icon: 'quality-high' },
          { key: 'browse', title: 'Orders', icon: 'clipboard-list' },
          { key: 'history', title: 'History', icon: 'history' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 2: // CK Supply
        return [
          { key: 'library', title: 'QC', icon: 'quality-high' },
          { key: 'browse', title: 'Dispatch', icon: 'truck-delivery' },
          { key: 'history', title: 'Orders', icon: 'clipboard-list' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 3: // Manager
        return [
          { key: 'library', title: 'Disputes', icon: 'alert-circle' },
          { key: 'browse', title: 'Products', icon: 'folder-cog' },
          { key: 'history', title: 'Orders', icon: 'clipboard-list' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      case 0: // Admin
        return [
          { key: 'library', title: 'Dashboard', icon: 'view-dashboard' },
          { key: 'browse', title: 'Users', icon: 'account-group' },
          { key: 'history', title: 'Reports', icon: 'chart-bar' },
          { key: 'settings', title: 'Settings', icon: 'cog' },
        ];
      
      default:
        return [
          { key: 'library', title: 'Home', icon: 'home' },
          { key: 'browse', title: 'Browse', icon: 'magnify' },
          { key: 'history', title: 'History', icon: 'history' },
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
    minWidth: 64,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default BottomNavigation;
