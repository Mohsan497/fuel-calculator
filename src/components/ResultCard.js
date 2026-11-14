import React from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';

import Card from './Card';
import PrimaryButton from './PrimaryButton';
import { colors, radius, spacing } from '../theme';
import { formatMoney, formatNumber } from '../utils/format';
import { buildShareText } from '../utils/calc';
import useResponsive from '../hooks/useResponsive';

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

export default function ResultCard({ trip, onSave }) {
  const { fs } = useResponsive();
  const { result, currency, inputs } = trip;

  const handleShare = async () => {
    try {
      await Share.share({ message: buildShareText(trip) });
    } catch (e) {
      // User cancelled or share unavailable; nothing to do.
    }
  };

  return (
    <Card style={styles.card}>
      <Text style={styles.heroLabel}>Total fuel cost</Text>
      <Text
        style={[styles.heroValue, { fontSize: fs(36) }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatMoney(result.cost, currency)}
      </Text>

      <View style={styles.grid}>
        <Stat
          label={inputs.roundTrip ? 'Distance (round trip)' : 'Distance'}
          value={`${formatNumber(result.totalDistance, 1)} km`}
        />
        <Stat label="Fuel needed" value={`${formatNumber(result.fuel, 2)} L`} />
        <Stat label="Cost per km" value={formatMoney(result.perKm, currency)} />
        {inputs.people > 1 ? (
          <Stat
            label={`Per person (${inputs.people})`}
            value={formatMoney(result.perPerson, currency)}
          />
        ) : null}
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          title="Save trip"
          icon="bookmark-outline"
          onPress={onSave}
          style={styles.actionBtn}
        />
        <PrimaryButton
          title="Share"
          icon="share-social-outline"
          variant="secondary"
          onPress={handleShare}
          style={styles.actionBtn}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.lg },
  heroLabel: { fontSize: 13, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
  heroValue: {
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  stat: {
    width: '48.5%',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  statLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  actions: { flexDirection: 'row', marginTop: spacing.sm },
  actionBtn: { flex: 1, marginHorizontal: spacing.xs },
});
