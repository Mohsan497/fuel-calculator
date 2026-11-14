import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@fuelcalculator/v1';

export async function loadPersisted() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (e) {
    return null;
  }
}

export async function savePersisted(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Storage failure should never crash the app.
  }
}
