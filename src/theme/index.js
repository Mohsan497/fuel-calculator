import { Platform } from 'react-native';

export const colors = {
  primary: '#0B7A75',
  primaryDark: '#075E5A',
  primarySoft: '#E0F2F1',
  accent: '#F59E0B',
  accentSoft: '#FEF3C7',
  background: '#F3F6F8',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  success: '#16A34A',
  white: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.5)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24 };

export const shadow = Platform.select({
  ios: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
  default: {},
});

export const MAX_CONTENT_WIDTH = 640;
