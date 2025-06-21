import { getData } from '@/libs/asyncStorage.libs';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  console.log('index is called');

  const router = useRouter();

    useEffect(() => {
    (async () => {
      const token = await getData('user_token');
      if(!token && typeof token !== "string") router.replace("/(auth)/login");
      else router.replace("/(auth)/login")

      console.log('token:', token);
    })();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" />
    </View>
  );
}
