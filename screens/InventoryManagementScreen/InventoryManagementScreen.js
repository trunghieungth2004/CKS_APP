import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Appbar, SegmentedButtons, Text, Surface, ActivityIndicator, Chip } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import RawMaterialsScreen from '../RawMaterialsScreen/RawMaterialsScreen';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { formatDateTime } from '../../utils/validators';

export default function InventoryManagementScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('inventory');

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Inventory Management" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            {
              value: 'inventory',
              label: 'Inventory',
              icon: 'warehouse',
            },
            {
              value: 'materials',
              label: 'Raw Materials',
              icon: 'package-variant-closed',
            },
          ]}
          style={{ marginHorizontal: 16, marginTop: 8 }}
        />
      </View>

      <View style={styles.content}>
        {selectedTab === 'inventory' ? (
          <InventoryListScreen onNavigate={onNavigate} />
        ) : (
          <RawMaterialsScreen onNavigate={onNavigate} />
        )}
      </View>
    </View>
  );
}

function InventoryListScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    const [invResult, matResult] = await Promise.all([
      apiService.post(API_ENDPOINTS.INVENTORY.CK, {}),
      apiService.get(API_ENDPOINTS.RAW_MATERIAL.ALL),
    ]);
    setLoading(false);

    if (invResult.success && invResult.data.data?.inventory) {
      setInventory(invResult.data.data.inventory);
    }

    if (matResult.success && matResult.data.data) {
      const matMap = {};
      matResult.data.data.forEach(mat => {
        matMap[mat.material_id] = mat;
      });
      setMaterials(matMap);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventory();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RAW':
        return paperTheme.colors.primaryContainer;
      case 'COOKED':
        return paperTheme.colors.secondaryContainer;
      default:
        return paperTheme.colors.surfaceVariant;
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'RAW':
        return paperTheme.colors.onPrimaryContainer;
      case 'COOKED':
        return paperTheme.colors.onSecondaryContainer;
      default:
        return paperTheme.colors.onSurfaceVariant;
    }
  };

  return (
    <ScrollView
      style={styles.inventoryContainer}
      contentContainerStyle={styles.inventoryContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[paperTheme.colors.primary]} />
      }
    >
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>Loading inventory...</Text>
        </View>
      ) : inventory.length === 0 ? (
        <View style={styles.centerContent}>
          <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            No inventory items found
          </Text>
        </View>
      ) : (
        inventory.map((item) => {
          const material = materials[item.material_id];
          return (
            <Surface key={item.inventory_id} style={styles.inventoryCard} elevation={1}>
              <View style={styles.inventoryHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {material?.material_name || item.material_id}
                  </Text>
                  <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 2 }}>
                    ID: {item.inventory_id}
                  </Text>
                </View>
                <Chip
                  mode="flat"
                  compact
                  style={{ backgroundColor: getStatusColor(item.status) }}
                  textStyle={{ color: getStatusTextColor(item.status), fontSize: 11, fontWeight: '600' }}
                >
                  {item.status}
                </Chip>
              </View>

              <View style={styles.inventoryDetails}>
                <View style={styles.inventoryDetailRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Quantity:
                  </Text>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {Number(item.quantity).toFixed(2)} {item.unit}
                  </Text>
                </View>

                <View style={styles.inventoryDetailRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Last Updated:
                  </Text>
                  <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                    {formatDateTime(item.last_updated)}
                  </Text>
                </View>

                <View style={styles.inventoryDetailRow}>
                  <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                    Created:
                  </Text>
                  <Text variant="bodySmall">
                    {formatDateTime(item.created_at)}
                  </Text>
                </View>
              </View>
            </Surface>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingBottom: 8,
  },
  content: {
    flex: 1,
  },
  inventoryContainer: {
    flex: 1,
  },
  inventoryContent: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
  },
  inventoryCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inventoryDetails: {
    gap: 8,
  },
  inventoryDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
