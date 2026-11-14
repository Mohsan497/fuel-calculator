import { useWindowDimensions } from 'react-native';
import { MAX_CONTENT_WIDTH } from '../theme';

export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(Math.max(width / 375, 0.9), 1.25);
  const fs = (size) => Math.round(size * scale);

  return {
    width,
    height,
    isTablet: width >= 768,
    isLandscape: width > height,
    contentWidth: Math.min(width, MAX_CONTENT_WIDTH),
    fs,
  };
}
