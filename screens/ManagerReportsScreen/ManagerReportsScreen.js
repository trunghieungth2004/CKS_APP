import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Appbar, Surface, SegmentedButtons } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

export default function ManagerReportsScreen() {
  const { paperTheme } = useTheme();
  const [selectedReport, setSelectedReport] = useState('batches');

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <StatusBar style="auto" />
      
      <Appbar.Header elevated>
        <Appbar.Content title="Reports & Analytics" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={selectedReport}
          onValueChange={setSelectedReport}
          buttons={[
            { value: 'batches', label: 'Batches' },
            { value: 'inventory', label: 'Inventory' },
            { value: 'credits', label: 'Credits' },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={1}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
            {selectedReport === 'batches' && 'Batch Reports'}
            {selectedReport === 'inventory' && 'Inventory Reports'}
            {selectedReport === 'credits' && 'Credit Reports'}
          </Text>
          <Text variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant }}>
            Reports coming soon...
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentContainer: {
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
});
