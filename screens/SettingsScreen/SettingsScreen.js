import React from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { Text, Appbar, List, Switch, Divider, Button as PaperButton } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen({ user, onLogout }) {
  const { theme, paperTheme, isDarkMode, useMaterialYou, toggleTheme, toggleMaterialYou } = useTheme();

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

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style={theme.colors.statusBar} />
      
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView style={styles.scrollContent}>
        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Email"
            description={user?.email || 'Not logged in'}
            left={props => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Role"
            description={getRoleName(user?.role_id)}
            left={props => <List.Icon {...props} icon="account-badge" />}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description={isDarkMode ? 'Enabled' : 'Disabled'}
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                color={paperTheme.colors.primary}
              />
            )}
          />
          <List.Item
            title="Material You"
            description={useMaterialYou ? 'Dynamic colors enabled' : 'Standard colors'}
            left={props => <List.Icon {...props} icon="palette" />}
            right={() => (
              <Switch
                value={useMaterialYou}
                onValueChange={toggleMaterialYou}
                color={paperTheme.colors.primary}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Account Actions</List.Subheader>
          <View style={styles.logoutContainer}>
            <PaperButton
              mode="contained"
              onPress={handleLogout}
              buttonColor={paperTheme.colors.error}
              icon="logout"
              style={styles.logoutButton}
            >
              Logout
            </PaperButton>
          </View>
        </List.Section>

        <View style={styles.appInfo}>
          <Text variant="bodySmall" style={{ color: paperTheme.colors.outline }}>
            CKS App v1.0.0 • Material Design
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  logoutContainer: {
    padding: 16,
  },
  logoutButton: {
    marginVertical: 8,
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
  },
});