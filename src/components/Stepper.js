import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

export default function Stepper({ value, onChange, min = 1, max = 20 }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <View style={styles.row}>
      <Pressable
        onPress={dec}
        disabled={value <= min}
        hitSlop={8}
        accessibilityLabel="Decrease passengers"
        style={[styles.btn, value <= min && styles.btnDisabled]}
      >
        <Ionicons name="remove" size={20} color={colors.primaryDark} />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        onPress={inc}
        disabled={value >= max}
        hitSlop={8}
        accessibilityLabel="Increase passengers"
        style={[styles.btn, value >= max && styles.btnDisabled]}
      >
        <Ionicons name="add" size={20} color={colors.primaryDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  value: {
    minWidth: 40,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.xs,
  },
});
