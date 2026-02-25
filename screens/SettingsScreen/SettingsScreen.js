import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import styles from './SettingsScreen.styles';

export default function SettingsScreen({ user, onLogout }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: onLogout 
        },
      ]
    );
  };

  const SettingRow = ({ label, value, onPress, showArrow = false }) => (
    <TouchableOpacity 
      style={[styles.settingRow, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border.light,
      }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
        {label}
      </Text>
      <View style={styles.settingValue}>
        {typeof value === 'boolean' ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ 
              false: theme.colors.border.medium, 
              true: theme.colors.primary 
            }}
            thumbColor="#fff"
          />
        ) : (
          <>
            {value && (
              <Text style={[styles.valueText, { color: theme.colors.text.secondary }]}>
                {value}
              </Text>
            )}
            {showArrow && (
              <Text style={[styles.arrow, { color: theme.colors.text.tertiary }]}>›</Text>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
        {title}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.colors.statusBar} />
      
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border.light,
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <SectionHeader title="ACCOUNT" />
        <View style={styles.section}>
          <SettingRow 
            label="Email" 
            value={user?.email || 'Not logged in'}
          />
          <SettingRow 
            label="Role" 
            value={getRoleName(user?.role_id)}
          />
        </View>

        <SectionHeader title="APPEARANCE" />
        <View style={styles.section}>
          <SettingRow 
            label="Dark Mode" 
            value={isDarkMode}
            onPress={toggleTheme}
          />
        </View>

        <SectionHeader title="ACCOUNT ACTIONS" />
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.danger,
            }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={[styles.logoutText, { color: theme.colors.danger }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: theme.colors.text.tertiary }]}>
            CKS App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const getRoleName = (roleId) => {
  const roles = {
    0: 'Admin',
    1: 'CK Staff',
    2: 'CK Supply',
    3: 'Manager',
    4: 'Store Staff',
  };
  return roles[roleId] || 'Unknown';
};
