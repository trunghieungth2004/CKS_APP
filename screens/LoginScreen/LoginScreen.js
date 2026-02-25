import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import authService from '../../services/authService';

export default function LoginScreen({ onLoginSuccess }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Safety check for theme
  if (!theme || !theme.colors || !theme.shadows) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await authService.login(email, password);

    setLoading(false);

    if (result.success) {
      if (onLoginSuccess) {
        onLoginSuccess(result.data);
      }
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.colors.statusBar} />
      
      {/* Modern gradient-like header */}
      <View style={[styles.headerSection, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }]}>
              <Text style={styles.logoText}>CKS</Text>
            </View>
          </View>
          <Text style={styles.appTitle}>CKS System</Text>
          <Text style={styles.appTagline}>Supply Chain Management</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formSection}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formCard, { 
            backgroundColor: theme.colors.card,
            ...theme.shadows.medium,
          }]}>
            <Text style={[styles.welcomeText, { color: theme.colors.text.primary }]}>
              Welcome Back
            </Text>
            <Text style={[styles.loginSubtext, { color: theme.colors.text.secondary }]}>
              Sign in to continue
            </Text>

            <View style={styles.form}>
              <Input
                label="Email Address"
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
                error={errors.email}
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                error={errors.password}
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                variant="primary"
                style={styles.loginButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.text.tertiary }]}>
                Need help? Contact your administrator
              </Text>
            </View>
          </View>

          <View style={styles.versionInfo}>
            <Text style={[styles.versionText, { color: theme.colors.text.tertiary }]}>
              Version 1.0.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  formSection: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  formCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 30,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  loginSubtext: {
    fontSize: 15,
    marginBottom: 30,
  },
  form: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  footerText: {
    fontSize: 13,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
  },
});
