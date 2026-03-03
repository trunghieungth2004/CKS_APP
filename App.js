import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { PaperProvider, Text, Surface, Appbar, ActivityIndicator } from 'react-native-paper';
import { LoginScreen, DashboardScreen } from './screens';
import { BottomNavigation, Snackbar } from './components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StoreStaffNavigation, STORE_STAFF_TABS, CKStaffNavigation, CK_STAFF_TABS } from './navigation';
import apiService from './services/apiService';
import storage from './utils/storage';

function AppContent() {
  const { theme, paperTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(null);
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
      const savedStoreInfo = await storage.getItem('storeInfo');

      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
        apiService.setToken(savedToken);
        if (savedStoreInfo) {
          setStoreInfo(savedStoreInfo);
        }
        
        // Set default tab based on role
        if (savedUser.role_id === 4) {
          setCurrentTab('orders');
        } else if (savedUser.role_id === 1) {
          setCurrentTab('qc');
        } else {
          setCurrentTab('settings');
        }
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
    hideSnackbar();

    await storage.setItem('user', authData.user);
    await storage.setItem('token', authData.token);

    // Set default tab based on role
    if (authData.user.role_id === 4) {
      // Store Staff: default to orders tab
      setCurrentTab('orders');
      const storeInfoResult = await apiService.post('/api/user/store-info', {});
      if (storeInfoResult.success && storeInfoResult.data.data) {
        setStoreInfo(storeInfoResult.data.data);
        await storage.setItem('storeInfo', storeInfoResult.data.data);
      }
    } else if (authData.user.role_id === 1) {
      // CK Staff: default to QC tab
      setCurrentTab('qc');
    } else {
      // Other roles: default to settings
      setCurrentTab('settings');
    }
  };

  const handleLogout = async () => {
    setUser(null);
    setToken(null);
    setStoreInfo(null);
    apiService.clearToken();
    setCurrentScreen('Dashboard');
    setScreenParams({});
    setCurrentTab('orders');
    hideSnackbar();

    await storage.removeItem('user');
    await storage.removeItem('token');
    await storage.removeItem('storeInfo');
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
    // Store Staff (role_id 4)
    if (user.role_id === 4) {
      return (
        <StoreStaffNavigation
          currentTab={currentTab}
          currentScreen={currentScreen}
          screenParams={screenParams}
          ordersInitialStatus={ordersInitialStatus}
          storeInfo={storeInfo}
          user={user}
          onNavigate={handleNavigate}
          onBack={handleBack}
          onNavigateTab={handleNavigateTab}
          onStatusChange={setOrdersInitialStatus}
          onLogout={handleLogout}
        />
      );
    }

    // CK Staff (role_id 1)
    if (user.role_id === 1) {
      return (
        <CKStaffNavigation
          currentTab={currentTab}
          currentScreen={currentScreen}
          screenParams={screenParams}
          ordersInitialStatus={ordersInitialStatus}
          user={user}
          onNavigate={handleNavigate}
          onBack={handleBack}
          onStatusChange={setOrdersInitialStatus}
          onLogout={handleLogout}
        />
      );
    }

    // Fallback for other roles (Dashboard + Settings)
    switch (currentTab) {
      case 'settings':
        return <SettingsScreen user={user} storeInfo={storeInfo} onLogout={handleLogout} />;
      default:
        return <DashboardScreen user={user} onNavigate={handleNavigate} />;
    }
  };

  const getTabsForRole = () => {
    if (user.role_id === 4) return STORE_STAFF_TABS;
    if (user.role_id === 1) return CK_STAFF_TABS;
    return [{ key: 'settings', title: 'Settings', icon: 'cog' }];
  };

  return (
    <PaperProvider theme={paperTheme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderCurrentTab()}
        <BottomNavigation 
          currentTab={currentTab} 
          onTabChange={handleTabChange}
          tabs={getTabsForRole()}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
