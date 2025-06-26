import PublicGuard from '@/components/PublicGuard';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <>
      <PublicGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack>
            <Stack.Screen
              name="login"
              options={{ title: 'Sign In' }} // 👈 custom title
            />
            <Stack.Screen
              name="register"
              options={{ title: 'Create Account' }} // 👈 custom title
            />
          </Stack>
        </Stack>
      </PublicGuard>
    </>
  );
}
