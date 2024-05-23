import { Alert, Platform } from 'react-native';

const alertPolyfill = (title: string, description: string) => {
  alert(`${title}\n\n${description}`);
};

export function crossPlatformAlert(
  title: string,
  description: string,
  buttons: { text: string }[],
  options: { cancelable: boolean },
) {
  if (Platform.OS === 'web') {
    alertPolyfill(title, description);
  } else {
    Alert.alert(title, description, buttons, options);
  }
}

export default crossPlatformAlert;
