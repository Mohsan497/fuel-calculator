import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ScreenHeader from '../components/ScreenHeader';
import TripItem from '../components/TripItem';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { confirm } from '../utils/confirm';
import { colors, MAX_CONTENT_WIDTH, spacing } from '../theme';

export default function SavedScreen({ navigation }) {
  const { state, deleteSaved, loadTrip } = useApp();
  const { saved } = state;

  const handleUse = (trip) => {
    loadTrip(trip);
    navigation.navigate('Home');
  };

  const handleDelete = (trip) =>
    confirm('Delete saved trip', `Remove "${trip.name}" from saved trips?`, () =>
      deleteSaved(trip.id)
    );

  const subtitle =
    saved.length === 0
      ? 'Trips you bookmark appear here'
      : `${saved.length} saved trip${saved.length === 1 ? '' : 's'}`;

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Saved" subtitle={subtitle} />

      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripItem
            trip={item}
            title={item.name}
            timestamp={item.savedAt || item.createdAt}
            onUse={handleUse}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={[styles.content, saved.length === 0 && styles.emptyContent]}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No saved trips"
            message="Tap “Save trip” after a calculation to keep it here for quick access."
          />
        }
        showsVerticalScrollIndicator={false}
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
});
