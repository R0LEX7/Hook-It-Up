import Loader from '@/components/Loader';
import useUser from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function PublicGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  console.log(' auth guard called');

  useEffect(() => {
    if (!isLoading && user) {
      setTimeout(() => {
        router.replace('/(tabs)/explore');
      }, 0);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader />
      </View>
    );
  }

  if (user) return null;
  return <>{children}</>;
}
