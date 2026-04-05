import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, FAB, ActivityIndicator, Surface, Portal, Modal, Appbar, TextInput, Button, Divider } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';
import { API_ENDPOINTS } from '../../config/constants';

export default function RawMaterialsScreen({ onNavigate }) {
  const { paperTheme } = useTheme();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    const result = await apiService.get(API_ENDPOINTS.RAW_MATERIAL.ALL);
    setLoading(false);

    if (result.success && result.data.data) {
      setMaterials(result.data.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaterials();
    setRefreshing(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!materialName.trim()) {
      newErrors.materialName = 'Material name is required';
    }

    if (!unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    setCreating(true);
    const result = await apiService.post(API_ENDPOINTS.RAW_MATERIAL.CREATE, {
      material_name: materialName.trim(),
      description: description.trim(),
      unit: unit.trim(),
      price: parseFloat(price),
    });
    setCreating(false);

    if (result.success) {
      setCreateModalVisible(false);
      resetForm();
      loadMaterials();
    }
  };

  const resetForm = () => {
    setMaterialName('');
    setDescription('');
    setUnit('');
    setPrice('');
    setErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[paperTheme.colors.primary]} />
        }
      >
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>Loading raw materials...</Text>
          </View>
        ) : materials.length === 0 ? (
          <View style={styles.centerContent}>
            <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant }}>
              No raw materials found
            </Text>
            <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8 }}>
              Tap the + button to create your first material
            </Text>
          </View>
        ) : (
          materials.map((material) => (
            <Surface key={material.material_id} style={styles.materialCard} elevation={1}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', flex: 1 }}>
                  {material.material_name}
                </Text>
                <Text variant="titleMedium" style={{ color: paperTheme.colors.primary, fontWeight: 'bold' }}>
                  ${Number(material.price).toFixed(2)}
                </Text>
              </View>

              {material.description && (
                <Text 
                  variant="bodyMedium" 
                  style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8 }}
                >
                  {material.description}
                </Text>
              )}

              <View style={styles.unitBadge}>
                <Text variant="labelMedium" style={{ color: paperTheme.colors.primary }}>
                  Unit: {material.unit}
                </Text>
              </View>
            </Surface>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[
          styles.fab,
          { backgroundColor: paperTheme.colors.primaryContainer }
        ]}
        onPress={openCreateModal}
      />

      {/* Create Material Modal */}
      <Portal>
        <Modal
          visible={createModalVisible}
          onDismiss={() => !creating && setCreateModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={[styles.modalContent, { backgroundColor: paperTheme.colors.surface }]}>
            <Appbar.Header elevated style={{ backgroundColor: paperTheme.colors.surface }}>
              <Appbar.BackAction onPress={() => !creating && setCreateModalVisible(false)} />
              <Appbar.Content title="Create Raw Material" titleStyle={{ fontWeight: 'bold' }} />
            </Appbar.Header>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <TextInput
                label="Material Name *"
                value={materialName}
                onChangeText={(text) => {
                  setMaterialName(text);
                  if (errors.materialName) setErrors({ ...errors, materialName: null });
                }}
                mode="outlined"
                error={!!errors.materialName}
                disabled={creating}
                style={styles.input}
              />
              {errors.materialName && (
                <Text variant="bodySmall" style={{ color: paperTheme.colors.error, marginTop: -8, marginBottom: 8 }}>
                  {errors.materialName}
                </Text>
              )}

              <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                multiline
                numberOfLines={3}
                disabled={creating}
                style={styles.input}
              />

              <TextInput
                label="Unit *"
                value={unit}
                onChangeText={(text) => {
                  setUnit(text);
                  if (errors.unit) setErrors({ ...errors, unit: null });
                }}
                mode="outlined"
                error={!!errors.unit}
                placeholder="e.g., kg, L, pcs"
                disabled={creating}
                style={styles.input}
              />
              {errors.unit && (
                <Text variant="bodySmall" style={{ color: paperTheme.colors.error, marginTop: -8, marginBottom: 8 }}>
                  {errors.unit}
                </Text>
              )}

              <TextInput
                label="Price per Unit *"
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  if (errors.price) setErrors({ ...errors, price: null });
                }}
                mode="outlined"
                keyboardType="decimal-pad"
                error={!!errors.price}
                left={<TextInput.Affix text="$" />}
                disabled={creating}
                style={styles.input}
              />
              {errors.price && (
                <Text variant="bodySmall" style={{ color: paperTheme.colors.error, marginTop: -8, marginBottom: 8 }}>
                  {errors.price}
                </Text>
              )}

              <Divider style={{ marginVertical: 16 }} />

              <Button
                mode="contained"
                onPress={handleCreate}
                loading={creating}
                disabled={creating}
                style={styles.submitButton}
              >
                Create Material
              </Button>
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
  materialCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  modal: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});
