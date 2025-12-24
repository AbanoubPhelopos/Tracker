import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

export default function AppLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: Colors.dark.background, // Ensure header matches theme
            },
            headerTintColor: Colors.dark.text,
            contentStyle: {
                backgroundColor: Colors.dark.background,
            }
        }}>
            <Stack.Screen name="index" options={{ title: 'Goals' }} />
            <Stack.Screen name="goal/[id]" options={{ title: 'Goal Details' }} />
        </Stack>
    );
}
