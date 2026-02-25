import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { MenuButton } from '../../components';

const ROLE_NAMES = {
  0: 'Admin',
  1: 'CK Staff',
  2: 'CK Supply',
  3: 'Manager',
  4: 'Store Staff',
};

export default function DashboardScreen({ user, onNavigate }) {
  const { theme } = useTheme();

  // Safety check for theme
  if (!theme || !theme.colors || !theme.colors.border || !theme.colors.text) {
    return null;
  }

  const renderMenuByRole = () => {
    switch (user.role_id) {
      case 4:
        return (
          <>
            <MenuButton
              title="Create New Order"
              subtitle="Place order before 6:00 PM cutoff"
              onPress={() => onNavigate('CreateOrder')}
              variant="primary"
            />
            <MenuButton
              title="My Orders"
              subtitle="View and manage your orders"
              onPress={() => onNavigate('MyOrders')}
            />
            <MenuButton
              title="Confirm Delivery"
              subtitle="Confirm received deliveries"
              onPress={() => onNavigate('ConfirmDelivery')}
            />
            <MenuButton
              title="File Dispute"
              subtitle="Report delivery issues (within 1 hour)"
              onPress={() => onNavigate('FileDispute')}
            />
            <MenuButton
              title="My Disputes"
              subtitle="Track your dispute status"
              onPress={() => onNavigate('MyDisputes')}
            />
          </>
        );

      case 1:
        return (
          <>
            <MenuButton
              title="Raw Material QC"
              subtitle="Quality control for raw materials"
              onPress={() => onNavigate('RawMaterialQC')}
              variant="warning"
            />
            <MenuButton
              title="All Orders"
              subtitle="View all system orders"
              onPress={() => onNavigate('AllOrders')}
            />
          </>
        );

      case 2:
        return (
          <>
            <MenuButton
              title="Cooked Batch QC"
              subtitle="Quality control for cooked products"
              onPress={() => onNavigate('CookedBatchQC')}
              variant="success"
            />
            <MenuButton
              title="Dispatch Orders"
              subtitle="Manage order dispatch (5:00 AM)"
              onPress={() => onNavigate('DispatchOrders')}
            />
            <MenuButton
              title="Risk Pool Management"
              subtitle="Search and transfer from risk pool"
              onPress={() => onNavigate('RiskPool')}
            />
            <MenuButton
              title="All Orders"
              subtitle="View all system orders"
              onPress={() => onNavigate('AllOrders')}
            />
          </>
        );

      case 3:
        return (
          <>
            <MenuButton
              title="Resolve Disputes"
              subtitle="Review and resolve disputes"
              onPress={() => onNavigate('ResolveDisputes')}
              variant="warning"
            />
            <MenuButton
              title="Product Management"
              subtitle="Manage products and recipes"
              onPress={() => onNavigate('ProductManagement')}
            />
            <MenuButton
              title="All Disputes"
              subtitle="View all system disputes"
              onPress={() => onNavigate('AllDisputes')}
            />
          </>
        );

      case 0:
        return (
          <>
            <MenuButton
              title="All Orders"
              subtitle="Full system order access"
              onPress={() => onNavigate('AllOrders')}
            />
            <MenuButton
              title="User Management"
              subtitle="Manage system users"
              onPress={() => onNavigate('UserManagement')}
            />
            <MenuButton
              title="Resolve Disputes"
              subtitle="Admin dispute resolution"
              onPress={() => onNavigate('ResolveDisputes')}
            />
            <MenuButton
              title="System Reports"
              subtitle="View system analytics"
              onPress={() => onNavigate('Reports')}
            />
          </>
        );

      default:
        return (
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>
            Invalid role
          </Text>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.colors.statusBar} />
      
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border.light,
      }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          CKS System
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {ROLE_NAMES[user.role_id]} Dashboard
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuSection}>
          {renderMenuByRole()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  menuSection: {
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
