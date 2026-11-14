import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '../theme';
import useResponsive from '../hooks/useResponsive';

export default function ScreenHeader({ title, subtitle, right }) {
  const insets = useSafeAreaInsets();
  const { fs } = useResponsive();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.row}>
        <View style={styles.textWrap}>
          <Text style={[styles.title, { fontSize: fs(26) }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { fontSize: fs(14) }]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  textWrap: { flex: 1 },
  right: { marginLeft: spacing.md },
  title: { color: colors.white, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.8)', marginTop: 4 },
});
