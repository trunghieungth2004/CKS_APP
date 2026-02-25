import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  LoginScreen,
  DashboardScreen,
  CreateOrderScreen,
  MyOrdersScreen,
  RawMaterialQCScreen,
  CookedBatchQCScreen,
  ConfirmDeliveryScreen,
  FileDisputeScreen,
  SettingsScreen,
} from './screens';
import { Button, BottomNavigation } from './components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import apiService from './services/apiService';
import storage from './utils/storage';

// Placeholder component for unimplemented screens
const PlaceholderScreen = ({ screenName, onBack }) => {
  const { theme } = useTheme();
  
  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.text) {
    return null;
  }
  
  return (
    <View style={[styles.placeholderContainer, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.placeholderContent, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.placeholderTitle, { color: theme.colors.text.primary }]}>
          {screenName}
        </Text>
        <Text style={[styles.placeholderSubtitle, { color: theme.colors.text.secondary }]}>
          Coming Soon
        </Text>
        <View style={styles.placeholderButton}>
          <Button title="Back to Library" onPress={onBack} variant="primary" />
        </View>
      </View>
    </View>
  );
};

// Browse Screen - Placeholder
const BrowseScreen = () => {
  const { theme } = useTheme();
  
  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border || !theme.colors.text) {
    return null;
  }
  
  return (
    <View style={[styles.tabScreen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border.light,
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Browse
        </Text>
      </View>
      <View style={styles.centerContent}>
        <Text style={[styles.comingSoonText, { color: theme.colors.text.secondary }]}>
          Browse feature coming soon
        </Text>
      </View>
    </View>
  );
};

// History Screen - Placeholder
const HistoryScreen = () => {
  const { theme } = useTheme();
  
  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border || !theme.colors.text) {
    return null;
  }
  
  return (
    <View style={[styles.tabScreen, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border.light,
      }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          History
        </Text>
      </View>
      <View style={styles.centerContent}>
        <Text style={[styles.comingSoonText, { color: theme.colors.text.secondary }]}>
          History feature coming soon
        </Text>
      </View>
    </View>
  );
};

function AppContent() {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('library');
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [screenParams, setScreenParams] = useState({});

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const savedUser = await storage.getItem('user');
      const savedToken = await storage.getItem('token');

      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
        apiService.setToken(savedToken);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (authData) => {
    setUser(authData.user);
    setToken(authData.token);
    apiService.setToken(authData.token);

    await storage.setItem('user', authData.user);
    await storage.setItem('token', authData.token);
  };

  const handleLogout = async () => {
    setUser(null);
    setToken(null);
    apiService.clearToken();
    setCurrentScreen('Dashboard');
    setScreenParams({});
    setCurrentTab('library');

    await storage.removeItem('user');
    await storage.removeItem('token');
  };

  const handleNavigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleBack = () => {
    setCurrentScreen('Dashboard');
    setScreenParams({});
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    if (tab === 'library') {
      setCurrentScreen('Dashboard');
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderLibraryScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return (
          <DashboardScreen
            user={user}
            onNavigate={handleNavigate}
          />
        );
      case 'CreateOrder':
        return <CreateOrderScreen onBack={handleBack} />;
      case 'MyOrders':
        return <MyOrdersScreen onBack={handleBack} onNavigate={handleNavigate} />;
      case 'RawMaterialQC':
        return <RawMaterialQCScreen onBack={handleBack} />;
      case 'CookedBatchQC':
        return <CookedBatchQCScreen onBack={handleBack} />;
      case 'ConfirmDelivery':
        return <ConfirmDeliveryScreen onBack={handleBack} />;
      case 'FileDispute':
        return <FileDisputeScreen onBack={handleBack} />;
      case 'MyDisputes':
        return <PlaceholderScreen screenName="My Disputes" onBack={handleBack} />;
      case 'AllOrders':
        return <PlaceholderScreen screenName="All Orders" onBack={handleBack} />;
      case 'DispatchOrders':
        return <PlaceholderScreen screenName="Dispatch Orders" onBack={handleBack} />;
      case 'RiskPool':
        return <PlaceholderScreen screenName="Risk Pool Management" onBack={handleBack} />;
      case 'ResolveDisputes':
        return <PlaceholderScreen screenName="Resolve Disputes" onBack={handleBack} />;
      case 'ProductManagement':
        return <PlaceholderScreen screenName="Product Management" onBack={handleBack} />;
      case 'AllDisputes':
        return <PlaceholderScreen screenName="All Disputes" onBack={handleBack} />;
      case 'UserManagement':
        return <PlaceholderScreen screenName="User Management" onBack={handleBack} />;
      case 'Reports':
        return <PlaceholderScreen screenName="Reports" onBack={handleBack} />;
      default:
        return (
          <DashboardScreen
            user={user}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'library':
        return renderLibraryScreen();
      case 'browse':
        return <BrowseScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen user={user} onLogout={handleLogout} />;
      default:
        return renderLibraryScreen();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderCurrentTab()}
      <BottomNavigation 
        currentTab={currentTab} 
        onTabChange={handleTabChange}
        userRole={user?.role_id}
      />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabScreen: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderContent: {
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeholderSubtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  placeholderButton: {
    width: '100%',
  },
});
