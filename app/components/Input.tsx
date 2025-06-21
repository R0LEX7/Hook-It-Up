import { PRIMARY } from '@/constants/myColor';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';



const InputField: React.FC<InputFieldProps> = ({
  ...textInputProps
}) => {


  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="white"
        style={styles.input}
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth : 2,
    borderStyle : 'solid',
    borderColor: PRIMARY,
    width : 300,
    marginTop: 30,
    height : 60,
    paddingHorizontal : 15,
    borderRadius : 6,
  },
  input: {
    color: PRIMARY,
    // marginVertical: 10,
    width: 300,
    fontSize: 18,
  },
});

export default InputField;
