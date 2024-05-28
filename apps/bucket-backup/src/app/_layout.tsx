import { Stack } from 'expo-router/stack';
import { registerApp } from '../compositionRoot';
import { TamaguiProvider } from 'tamagui';
import { useFonts } from 'expo-font';
import tamaguiConfig from '../../tamagui.config';
import React, { useEffect, useState } from 'react';

export default function AppLayout() {
  const [dependenciesRegistered, setDependenciesRegistered] = useState(false);

  useEffect(() => {
    if (!dependenciesRegistered) {
      registerApp();
      setDependenciesRegistered(true);
    }
  }, [dependenciesRegistered]);

  const [loaded] = useFonts({
    // eslint-disable-next-line global-require
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    // eslint-disable-next-line global-require
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded || !dependenciesRegistered) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}
