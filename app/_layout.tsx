import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/src/database/db';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const setup = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (e) {
        console.error("DB Init error", e);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    if (!dbInitialized) return;

    // Check if we are in the auth group (login/register)
    // Since (auth) is a group, it won't appear in segments
    // @ts-ignore
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    const user = false; // Mock user

    // If not in auth group (i.e., we are inside the app) and not logged in
    // However, initially we might be at '/', which is protected.
    // If we are at '/' and not logged in, we should redirect to '/login'.
    if (!inAuthGroup && !user) {
      // Use timeout to avoid navigation race conditions during mount
      setTimeout(() => {
        // router.replace('/login'); // Uncomment to enable protection
      }, 100);
    }
  }, [dbInitialized, segments]);


  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
