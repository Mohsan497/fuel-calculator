import React, { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import ScreenHeader from '../components/ScreenHeader';
import Card from '../components/Card';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import Stepper from '../components/Stepper';
import CurrencyChips from '../components/CurrencyChips';
import ResultCard from '../components/ResultCard';
import SaveModal from '../components/SaveModal';
import { useApp } from '../context/AppContext';
import { calculate, createTrip, sameInputs, sanitizeNumber } from '../utils/calc';
import { CURRENCIES, getSymbol } from '../utils/format';
import { colors, MAX_CONTENT_WIDTH, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  const { state, setDraft, resetDraft, setCurrency, setCurrent, addHistory, addSaved } = useApp();
  const { draft, currency, current, history } = state;

  const [errors, setErrors] = useState({});
  const [saveOpen, setSaveOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const scrollRef = useRef(null);
  const mileageRef = useRef(null);
  const priceRef = useRef(null);

  const symbol = getSymbol(currency);

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  };

  const onChangeField = (field) => (text) => {
    setDraft({ [field]: sanitizeNumber(text) });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCalculate = () => {
    Keyboard.dismiss();
    const { errors: errs, result } = calculate(draft);
    if (errs) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const last = history[0];
    if (last && sameInputs(last, draft, currency)) {
      setCurrent(last);
    } else {
      const trip = createTrip(draft, currency, result);
      addHistory(trip);
      setCurrent(trip);
    }
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const handleReset = () => {
    Keyboard.dismiss();
    setErrors({});
    resetDraft();
  };

  const handleSave = (name) => {
    if (!current) return;
    addSaved(current, name);
    showToast('Trip saved');
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Fuel Calculator" subtitle="Plan your trip cost in seconds" />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card>
            <Text style={styles.sectionTitle}>Currency</Text>
            <CurrencyChips options={CURRENCIES} selected={currency} onSelect={setCurrency} />
          </Card>

          <Card style={styles.cardGap}>
            <Text style={styles.sectionTitle}>Trip details</Text>

            <InputField
              label="Distance"
              icon="navigate-outline"
              suffix="km"
              placeholder="0"
              keyboardType="decimal-pad"
              value={draft.distance}
              onChangeText={onChangeField('distance')}
              error={errors.distance}
              returnKeyType="next"
              onSubmitEditing={() => mileageRef.current?.focus()}
              blurOnSubmit={false}
            />
            <InputField
              ref={mileageRef}
              label="Vehicle mileage"
              icon="speedometer-outline"
              suffix="km/L"
              placeholder="0"
              keyboardType="decimal-pad"
              value={draft.mileage}
              onChangeText={onChangeField('mileage')}
              error={errors.mileage}
              returnKeyType="next"
              onSubmitEditing={() => priceRef.current?.focus()}
              blurOnSubmit={false}
            />
            <InputField
              ref={priceRef}
              label="Fuel price per litre"
              icon="pricetag-outline"
              suffix={`${symbol}/L`}
              placeholder="0"
              keyboardType="decimal-pad"
              value={draft.price}
              onChangeText={onChangeField('price')}
              error={errors.price}
              returnKeyType="done"
              onSubmitEditing={handleCalculate}
            />

            <View style={styles.optionRow}>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Round trip</Text>
                <Text style={styles.optionHint}>Count the way back too</Text>
              </View>
              <Switch
                value={draft.roundTrip}
                onValueChange={(v) => setDraft({ roundTrip: v })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Passengers</Text>
                <Text style={styles.optionHint}>Split the cost equally</Text>
              </View>
              <Stepper value={draft.people} onChange={(v) => setDraft({ people: v })} />
            </View>

            <View style={styles.buttons}>
              <PrimaryButton
                title="Calculate"
                icon="calculator-outline"
                onPress={handleCalculate}
                style={styles.mainBtn}
              />
              <PrimaryButton
                title="Reset"
                icon="refresh-outline"
                variant="secondary"
                onPress={handleReset}
                style={styles.sideBtn}
              />
            </View>
          </Card>

          {current ? <ResultCard trip={current} onSave={() => setSaveOpen(true)} /> : null}

          {toast ? (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <SaveModal
        visible={saveOpen}
        onClose={() => setSaveOpen(false)}
        onSave={handleSave}
        defaultName=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  cardGap: { marginTop: spacing.lg },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  optionText: { flex: 1, marginRight: spacing.md },
  optionTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  optionHint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  buttons: { flexDirection: 'row', marginTop: spacing.md },
  mainBtn: { flex: 2, marginRight: spacing.sm },
  sideBtn: { flex: 1 },
  toast: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 24,
  },
  toastText: { color: colors.white, fontWeight: '600' },
});
