import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from './Card';
import { colors, radius, spacing } from '../theme';
import { formatDate, formatMoney, formatNumber } from '../utils/format';

function IconButton({ name, color, bg, onPress, label }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.iconBtn, { backgroundColor: bg }, pressed && styles.pressed]}
    >
      <Ionicons name={name} size={18} color={color} />
    </Pressable>
  );
}

export default function TripItem({ trip, title, timestamp, onUse, onSave, onDelete }) {
  const { inputs, result, currency } = trip;

  const details = [
    `${formatNumber(result.totalDistance, 1)} km${inputs.roundTrip ? ' (round trip)' : ''}`,
    `${formatNumber(result.fuel, 2)} L`,
    `${formatNumber(inputs.mileage, 1)} km/L`,
  ].join('  •  ');

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title || formatMoney(inputs.price, currency) + ' / L'}
          </Text>
          <Text style={styles.date}>{formatDate(timestamp)}</Text>
        </View>
        <Text style={styles.cost} numberOfLines={1}>
          {formatMoney(result.cost, currency)}
        </Text>
      </View>

      <Text style={styles.details}>{details}</Text>
      {title ? (
        <Text style={styles.meta}>
          Fuel {formatMoney(inputs.price, currency)} / L
          {inputs.people > 1 ? `  •  ${inputs.people} people` : ''}
        </Text>
      ) : inputs.people > 1 ? (
        <Text style={styles.meta}>{inputs.people} people</Text>
      ) : null}

      <View style={styles.actions}>
        <IconButton
          name="refresh-outline"
          color={colors.primaryDark}
          bg={colors.primarySoft}
          label="Use this trip again"
          onPress={() => onUse(trip)}
        />
        {onSave ? (
          <IconButton
            name="bookmark-outline"
            color={colors.accent}
            bg={colors.accentSoft}
            label="Save trip"
            onPress={() => onSave(trip)}
          />
        ) : null}
        <IconButton
          name="trash-outline"
          color={colors.danger}
          bg={colors.dangerSoft}
          label="Delete trip"
          onPress={() => onDelete(trip)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  top: { flexDirection: 'row', alignItems: 'flex-start' },
  titleWrap: { flex: 1, marginRight: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  cost: { fontSize: 18, fontWeight: '800', color: colors.primary, maxWidth: '45%' },
  details: { fontSize: 13, color: colors.textMuted, marginTop: spacing.md },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.md },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  pressed: { opacity: 0.7 },
});
