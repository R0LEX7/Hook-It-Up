import { FONT } from '@/constants/fonts.constant';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface IProps {
  title: string;
  isChecked: boolean;
  onPressHandler: () => void;
}

const CheckBox = ({ title, isChecked, onPressHandler }: IProps) => {
  const iconName = isChecked ? 'checkbox-marked' : 'checkbox-blank-outline';

  return (
    <View >
      <Pressable onPress={onPressHandler} style={styles.container}>
        <MaterialCommunityIcons name={iconName} size={24} color="#000" />
      <Text style={styles.title}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: 150,
    marginTop: 8,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
    fontWeight: '600',
    fontFamily: FONT.semiBold,
  },
});
