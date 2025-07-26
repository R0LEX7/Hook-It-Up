import Loader from '@/components/Loader';
import useUser from '@/hooks/useUser';
import { storeData } from '@/libs/asyncStorage.libs';
import { usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();



  useEffect(() => {
    if (!isLoading && !user) {
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 0);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (
      user &&
      pathname &&
      !pathname.startsWith('/auth') &&
      pathname !== '/explore'
    ) {
      storeData('lastRoute', pathname);
    }
  }, [pathname, user]);

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader />
      </View>
    );
  }

  return <>{children}</>;
}
