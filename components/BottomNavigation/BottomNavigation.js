import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const BottomNavigation = ({ currentTab, onTabChange, tabs }) => {
  const { paperTheme } = useTheme();

  if (!tabs || tabs.length === 0) {
    return null;
  }

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
