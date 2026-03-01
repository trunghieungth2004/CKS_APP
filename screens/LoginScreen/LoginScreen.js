import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Text, Surface, Divider, TextInput } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import authService from '../../services/authService';

export default function LoginScreen({ onLoginSuccess }) {
  const { theme, paperTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  if (!paperTheme || !paperTheme.colors) {
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
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style={paperTheme.dark ? 'light' : 'dark'} />

      <Surface style={[styles.headerSection, { backgroundColor: paperTheme.colors.primary }]} elevation={0}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Surface style={[styles.logoCircle, { 
              backgroundColor: paperTheme.colors.primaryContainer,
            }]} elevation={3}>
              <Text variant="displayMedium" style={{ color: paperTheme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
                C
              </Text>
            </Surface>
          </View>
          <Text variant="headlineLarge" style={[styles.appTitle, { color: paperTheme.colors.onPrimary }]}>
            CKS System
          </Text>
          <Text variant="labelLarge" style={[styles.appTagline, { color: paperTheme.colors.onPrimary }]}>
            Supply Chain Management
          </Text>
        </View>
      </Surface>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formSection}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.formCard} elevation={2}>
            <Text variant="headlineSmall" style={[styles.welcomeText, { color: paperTheme.colors.onSurface }]}>
              Welcome Back
            </Text>
            <Text variant="bodyLarge" style={[styles.loginSubtext, { color: paperTheme.colors.onSurfaceVariant }]}>
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
                left={<TextInput.Icon icon="email" />}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                error={errors.password}
                left={<TextInput.Icon icon="lock" />}
                right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                variant="primary"
                style={styles.loginButton}
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.footer}>
              <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                Need help? Contact your administrator
              </Text>
            </View>
          </Surface>

          <View style={styles.versionInfo}>
            <Text variant="labelSmall" style={{ color: paperTheme.colors.outline }}>
              Version 1.0.0 • Material Design
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
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  appTagline: {
    letterSpacing: 1,
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
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loginSubtext: {
    marginBottom: 24,
  },
  form: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
