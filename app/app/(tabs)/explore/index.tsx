import { getData } from '@/libs/asyncStorage.libs';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

const Index = () => {
  useEffect(() => {
    (async () => {
      const token = await getData('user_token');

      console.log('token from exp:', token);
    })();
  }, []);
  return (
    <View>
      <Text>explore</Text>
    </View>
  );
};

export default Index;
