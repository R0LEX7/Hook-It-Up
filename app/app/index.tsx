import Loader from '@/components/Loader';
import { getData } from '@/libs/asyncStorage.libs';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Index() {
  console.log('index');

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      const redirectToLastScreen = async () => {
        const lastRoute = await getData('lastRoute');
        console.log("last route " , lastRoute)
        if (lastRoute && lastRoute !== '/') {
          router.replace(lastRoute);
        } else {
          router.replace('/(tabs)/explore');
        }
      };
      redirectToLastScreen();
    }, 0);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Loader />
    </View>
  );
}
