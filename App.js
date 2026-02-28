import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PaperProvider, Text, Surface, Appbar, ActivityIndicator } from 'react-native-paper';
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
  const { theme, paperTheme } = useTheme();
  
  return (
    <View style={[styles.placeholderContainer, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={screenName} />
      </Appbar.Header>
      <View style={styles.placeholderContent}>
        <Surface style={styles.comingSoonCard} elevation={2}>
          <Text variant="headlineMedium" style={[styles.placeholderTitle, { color: paperTheme.colors.onSurface }]}>
            {screenName}
          </Text>
          <Text variant="bodyLarge" style={[styles.placeholderSubtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
            Coming Soon
          </Text>
          <View style={styles.placeholderButton}>
            <Button title="Back" onPress={onBack} variant="primary" />
          </View>
        </Surface>
      </View>
    </View>
  );
};

// Browse Screen - Placeholder
const BrowseScreen = () => {
  const { paperTheme } = useTheme();
  
  return (
    <View style={[styles.tabScreen, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content title="Browse" />
      </Appbar.Header>
      <View style={styles.centerContent}>
        <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
          Browse feature coming soon
        </Text>
      </View>
    </View>
  );
};

// History Screen - Placeholder
const HistoryScreen = () => {
  const { paperTheme } = useTheme();
  
  return (
    <View style={[styles.tabScreen, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header elevated mode="center-aligned">
        <Appbar.Content title="History" />
      </Appbar.Header>
      <View style={styles.centerContent}>
        <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
          History feature coming soon
        </Text>
      </View>
    </View>
  );
};

function AppContent() {
  const { theme, paperTheme } = useTheme();
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
    return (
      <PaperProvider theme={paperTheme}>
        <View style={[styles.container, styles.centerContent, { backgroundColor: paperTheme.colors.background }]}>
          <ActivityIndicator size="large" color={paperTheme.colors.primary} />
          <Text variant="bodyLarge" style={{ marginTop: 16, color: paperTheme.colors.onSurface }}>
            Loading...
          </Text>
        </View>
      </PaperProvider>
    );
  }

  if (!user) {
    return (
      <PaperProvider theme={paperTheme}>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </PaperProvider>
    );
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
    <PaperProvider theme={paperTheme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderCurrentTab()}
        <BottomNavigation 
          currentTab={currentTab} 
          onTabChange={handleTabChange}
          userRole={user?.role_id}
        />
      </View>
    </PaperProvider>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderContainer: {
    flex: 1,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  comingSoonCard: {
    padding: 32,
    borderRadius: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  placeholderTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  placeholderButton: {
    width: '100%',
    marginTop: 8,
  },
});
