import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/Button/Button';
import styles from './HomeScreen.styles';

const ROLE_NAMES = {
  0: 'Admin',
  1: 'CK Staff',
  2: 'CK Supply',
  3: 'Manager',
  4: 'Store Staff',
};

export default function HomeScreen({ user, onLogout }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>You are logged in</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>User Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue}>{user.user_id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>
                {ROLE_NAMES[user.role_id] || `Role ${user.role_id}`}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Logout"
              onPress={onLogout}
              variant="danger"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
