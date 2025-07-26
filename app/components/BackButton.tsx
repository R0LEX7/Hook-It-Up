import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const BackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className=" p-4 flex items-center justify-center absolute left-1"

      onPress={() => router.back()}
    >
      <MaterialIcons
        name="arrow-back-ios"
        strokeWidth={12}
        size={30}
        color="black"
      />
    </TouchableOpacity>
  );
};

export default BackButton;
