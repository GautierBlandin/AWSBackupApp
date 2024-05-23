import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { registerInfrastructure } from '@/compositionRoot';

export default function AppLayout() {
  useEffect(() => {
    registerInfrastructure();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
