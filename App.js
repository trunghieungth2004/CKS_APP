import React, { useState, useEffect } from 'react';
import {
  LoginScreen,
  DashboardScreen,
  CreateOrderScreen,
  MyOrdersScreen,
  RawMaterialQCScreen,
  CookedBatchQCScreen,
  ConfirmDeliveryScreen,
  FileDisputeScreen,
} from './screens';
import apiService from './services/apiService';
import storage from './utils/storage';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return null;
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return (
          <DashboardScreen
            user={user}
            onLogout={handleLogout}
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
      default:
        return (
          <DashboardScreen
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return renderScreen();
}
