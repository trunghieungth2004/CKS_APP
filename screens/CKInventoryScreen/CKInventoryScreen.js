import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Searchbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';
import { formatDateTime } from '../../utils/validators';

export default function CKInventoryScreen({ onBack }) {
  const { paperTheme } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [materials, setMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    setRefreshing(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    loadInventory();
  };

  const filteredInventory = inventory.filter(item => {
    const material = materials[item.material_id];
    const materialName = material?.material_name || '';
    const materialId = item.material_id || '';
    const inventoryId = item.inventory_id || '';
    const query = searchQuery.toLowerCase();
    return materialName.toLowerCase().includes(query) || 
           materialId.toLowerCase().includes(query) ||
           inventoryId.toLowerCase().includes(query);
  });

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
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        {onBack && <Appbar.BackAction onPress={onBack} />}
        <Appbar.Content title="CK Inventory" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search materials..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[paperTheme.colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading inventory...</Text>
          </View>
        ) : filteredInventory.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              {searchQuery ? 'No materials found' : 'No inventory items'}
            </Text>
          </View>
        ) : (
          filteredInventory.map((item) => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    marginBottom: 0,
    elevation: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 60,
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
