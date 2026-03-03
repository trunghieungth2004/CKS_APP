import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, Appbar, ActivityIndicator, Surface, Chip, Searchbar, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';

export default function CKInventoryScreen({ onBack }) {
  const { paperTheme } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    const result = await apiService.post('/api/inventory/ck');
    setLoading(false);
    setRefreshing(false);

    if (result.success && result.data.data && result.data.data.inventory) {
      setInventory(result.data.data.inventory);
    } else {
      console.error('Failed to load inventory:', result.message);
      setInventory([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInventory();
  };

  const filteredInventory = inventory.filter(item => {
    const materialId = item.material_id || '';
    return materialId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (status) => {
    if (status === 'RAW') return paperTheme.colors.tertiaryContainer;
    return paperTheme.colors.surfaceVariant;
  };

  const getStatusTextColor = (status) => {
    if (status === 'RAW') return paperTheme.colors.onTertiaryContainer;
    return paperTheme.colors.onSurfaceVariant;
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        {onBack && <Appbar.BackAction onPress={onBack} />}
        <Appbar.Content title="CK Inventory" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search by material ID..."
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
          filteredInventory.map((item) => (
            <Surface key={item.inventory_id} style={styles.inventoryCard} elevation={1}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {item.material_id}
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

              <Divider style={{ marginVertical: 12 }} />

              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  Quantity
                </Text>
                <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                  {item.quantity.toFixed(2)} {item.unit}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  Last Updated
                </Text>
                <Text variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant }}>
                  {new Date(item.last_updated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </Surface>
          ))
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
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
