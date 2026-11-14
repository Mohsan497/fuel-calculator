import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/ScreenHeader';
import TripItem from '../components/TripItem';
import EmptyState from '../components/EmptyState';
import SaveModal from '../components/SaveModal';
import { useApp } from '../context/AppContext';
import { confirm } from '../utils/confirm';
import { colors, MAX_CONTENT_WIDTH, radius, spacing } from '../theme';

export default function HistoryScreen({ navigation }) {
  const { state, deleteHistory, clearHistory, addSaved, loadTrip } = useApp();
  const { history } = state;
  const [tripToSave, setTripToSave] = useState(null);

  const handleUse = (trip) => {
    loadTrip(trip);
    navigation.navigate('Home');
  };

  const handleDelete = (trip) =>
    confirm('Delete calculation', 'Remove this calculation from history?', () =>
      deleteHistory(trip.id)
    );

  const handleClear = () =>
    confirm('Clear history', 'All calculations in history will be removed.', clearHistory, 'Clear');

  const subtitle =
    history.length === 0
      ? 'Your calculations appear here'
      : `${history.length} calculation${history.length === 1 ? '' : 's'}`;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="History"
        subtitle={subtitle}
        right={
          history.length > 0 ? (
            <Pressable
              onPress={handleClear}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear history"
              style={styles.clearBtn}
            >
              <Ionicons name="trash-outline" size={20} color={colors.white} />
            </Pressable>
          ) : null
        }
      />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripItem
            trip={item}
            timestamp={item.createdAt}
            onUse={handleUse}
            onSave={setTripToSave}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={[styles.content, history.length === 0 && styles.emptyContent]}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No history yet"
            message="Every calculation you make on the Home tab is stored here automatically."
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <SaveModal
        visible={!!tripToSave}
        onClose={() => setTripToSave(null)}
        onSave={(name) => tripToSave && addSaved(tripToSave, name)}
        defaultName=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  emptyContent: { flexGrow: 1 },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
