import { Stack } from 'expo-router/stack';
import { registerInfrastructure } from '@/compositionRoot';

export default function AppLayout() {
  registerInfrastructure();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
