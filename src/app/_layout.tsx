import { Stack } from 'expo-router/stack';
import { registerInfrastructure } from '@/compositionRoot';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../../tamagui.config';

export default function AppLayout() {
  registerInfrastructure();

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}
