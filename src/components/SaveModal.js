import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import PrimaryButton from './PrimaryButton';
import { colors, radius, spacing } from '../theme';

export default function SaveModal({ visible, onClose, onSave, defaultName = '' }) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (visible) setName(defaultName);
  }, [visible, defaultName]);

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Save trip</Text>
          <Text style={styles.hint}>Give this trip a name so you can find it later.</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Office commute"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            maxLength={40}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <View style={styles.row}>
            <PrimaryButton
              title="Cancel"
              variant="secondary"
              onPress={onClose}
              style={styles.btn}
            />
            <PrimaryButton title="Save" icon="checkmark" onPress={handleSave} style={styles.btn} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text },
  hint: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row' },
  btn: { flex: 1, marginHorizontal: spacing.xs },
});
