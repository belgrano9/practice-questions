import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerBackTitle: '',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Accueil' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen
          name="questions"
          options={{
            presentation: 'card',
            title: Platform.OS === 'android' ? 'Accueil' : 'Questions',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
      <SpeedInsights />
    </ThemeProvider>
  );
}
