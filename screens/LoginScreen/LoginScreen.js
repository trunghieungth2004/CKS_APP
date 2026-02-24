import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import authService from '../../services/authService';
import styles from './LoginScreen.styles';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      Alert.alert('Success', result.message);
      if (onLoginSuccess) {
        onLoginSuccess(result.data);
      }
    } else {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>CKS App</Text>
            <Text style={styles.subtitle}>Welcome Back</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
              error={errors.email}
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
              title="Login"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
