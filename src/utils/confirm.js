import { Alert } from 'react-native';

export function confirm(title, message, onConfirm, confirmText = 'Delete') {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
