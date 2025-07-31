import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const BackButton = () => {
  const router = useRouter();
  return (
    <Pressable
      className=" px-4 pt-1 flex items-center justify-center absolute left-1"

      onPress={() => router.back()}
    >
      <MaterialIcons
        name="arrow-back-ios"
        strokeWidth={12}
        size={30}
        color="black"
      />
    </Pressable>
  );
};

export default BackButton;
