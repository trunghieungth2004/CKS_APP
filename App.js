import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { PaperProvider, Text, Surface, Appbar, ActivityIndicator } from 'react-native-paper';
import {
  LoginScreen,
  DashboardScreen,
  CreateOrderScreen,
  MyOrdersScreen,
  OrderDetailScreen,
  RawMaterialQCScreen,
  CookedBatchQCScreen,
  ConfirmDeliveryScreen,
  DisputesScreen,
  SettingsScreen,
  InventoryScreen,
} from './screens';
import { Button, BottomNavigation, Snackbar } from './components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import apiService from './services/apiService';
import storage from './utils/storage';

const PlaceholderScreen = ({ screenName }) => {
  const { paperTheme } = useTheme();
  
  return (
    <View style={[styles.placeholderContainer, { backgroundColor: paperTheme.colors.background }]}>
      <Appbar.Header elevated>
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
        </Surface>
      </View>
    </View>
  );
};

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
  const [ordersInitialStatus, setOrdersInitialStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    loadAuthData();
  }, []);

  useEffect(() => {
    if (!token) return;

    verifyCurrentToken();

    const interval = setInterval(() => {
      verifyCurrentToken();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  const verifyCurrentToken = async () => {
    if (!token) return;

    const authService = (await import('./services/authService')).default;
    const result = await authService.verifyToken(token);

    if (!result.success) {
      setSnackbar({
        visible: true,
        message: 'Session expired. Please login again.',
        type: 'error',
      });
      setTimeout(() => {
        handleLogout();
      }, 2000);
    }
  };

  const showMessage = (message, type = 'info') => {
    setSnackbar({ visible: true, message, type });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, visible: false });
  };

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
    setCurrentTab('orders');

    await storage.removeItem('user');
    await storage.removeItem('token');
  };

  const handleNavigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleNavigateTab = (tab, status = null) => {
    setCurrentTab(tab);
    if (status) {
      setOrdersInitialStatus(status);
    }
    setCurrentScreen('Dashboard');
  };

  const handleBack = () => {
    setCurrentScreen('Dashboard');
    setScreenParams({});
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setCurrentScreen('Dashboard');
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

  const renderCurrentTab = () => {
    if (user.role_id === 4) {
      if (currentScreen === 'OrderDetail' && screenParams.orderId) {
        return <OrderDetailScreen orderId={screenParams.orderId} onBack={handleBack} onNavigateTab={handleNavigateTab} />;
      }

      switch (currentTab) {
        case 'orders':
          return <MyOrdersScreen onNavigate={handleNavigate} initialStatus={ordersInitialStatus} onStatusChange={() => setOrdersInitialStatus(null)} />;
        case 'create':
          return <CreateOrderScreen onNavigateTab={handleNavigateTab} />;
        case 'inventory':
          return <InventoryScreen />;
        case 'disputes':
          return <DisputesScreen />;
        case 'settings':
          return <SettingsScreen user={user} onLogout={handleLogout} />;
        default:
          return <MyOrdersScreen onNavigate={handleNavigate} initialStatus={ordersInitialStatus} onStatusChange={() => setOrdersInitialStatus(null)} />;
      }
    }

    switch (currentTab) {
      case 'settings':
        return <SettingsScreen user={user} onLogout={handleLogout} />;
      default:
        if (currentScreen !== 'Dashboard') {
          switch (currentScreen) {
            case 'CreateOrder':
              return <CreateOrderScreen />;
            case 'MyOrders':
              return <MyOrdersScreen onNavigate={handleNavigate} />;
            case 'RawMaterialQC':
              return <RawMaterialQCScreen onBack={handleBack} />;
            case 'CookedBatchQC':
              return <CookedBatchQCScreen onBack={handleBack} />;
            case 'ConfirmDelivery':
              return <ConfirmDeliveryScreen onBack={handleBack} />;
            case 'FileDispute':
              return <FileDisputeScreen onBack={handleBack} />;
            case 'MyDisputes':
              return <PlaceholderScreen screenName="My Disputes" />;
            case 'AllOrders':
              return <PlaceholderScreen screenName="All Orders" />;
            case 'DispatchOrders':
              return <PlaceholderScreen screenName="Dispatch Orders" />;
            case 'RiskPool':
              return <PlaceholderScreen screenName="Risk Pool Management" />;
            case 'ResolveDisputes':
              return <PlaceholderScreen screenName="Resolve Disputes" />;
            case 'ProductManagement':
              return <PlaceholderScreen screenName="Product Management" />;
            case 'AllDisputes':
              return <PlaceholderScreen screenName="All Disputes" />;
            case 'UserManagement':
              return <PlaceholderScreen screenName="User Management" />;
            case 'Reports':
              return <PlaceholderScreen screenName="Reports" />;
            default:
              return <DashboardScreen user={user} onNavigate={handleNavigate} />;
          }
        }
        return <DashboardScreen user={user} onNavigate={handleNavigate} />;
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
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onDismiss={hideSnackbar}
          duration={snackbar.type === 'error' ? 4000 : 3000}
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
