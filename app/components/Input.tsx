import { FONT } from '@/constants/fonts.constant';
import { PRIMARY } from '@/constants/myColor';
import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

interface InputFieldProps extends TextInputProps {}

const InputField: React.FC<InputFieldProps> = (props) => {
  return (
    <View className="flex-row items-center border-2 rounded-md h-[50px] w-[300px] px-4" style={{ borderColor: PRIMARY }}>
      <TextInput
        placeholderTextColor="white"
        className="text-[18px] w-full"
        style={{ color: PRIMARY , fontFamily : FONT.medium }}
        {...props}
      />
    </View>
  );
};

export default InputField;
