# Fuel Calculator

A simple, offline fuel cost calculator built with React Native and Expo SDK 54.

- Package / bundle ID: `com.fuelcalculator.developer`
- No backend, all data is stored on the device (AsyncStorage)
- Screens: Home (calculator), History, Saved

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (SDK 54) or press `a` for the Android emulator / `i` for iOS simulator.

## Folder structure

```
App.js
index.js
src/
  components/   reusable UI (Card, InputField, TripItem, ...)
  context/      global state + persistence
  hooks/        useResponsive
  navigation/   bottom tab navigator
  screens/      Home, History, Saved
  theme/        colors, spacing, shadows
  utils/        calculation, formatting, storage
assets/         app icons
```

## Build for stores (optional)

```bash
npm install -g eas-cli
eas build --platform android
```
