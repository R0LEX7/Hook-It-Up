// components/HobbiesInput.tsx
import { FONT } from '@/constants/fonts.constant';
import { PRIMARY } from '@/constants/myColor';
import { IUser } from '@/interfaces/user.interface';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface IProps {
  credentials: IUser;
  setCredentials: React.Dispatch<React.SetStateAction<IUser>>;
}

const MAX_TAGS = 4;

export const HobbiesInput = ({ credentials, setCredentials }: IProps) => {
  const [text, setText] = useState('');

  const addTag = () => {
    const tag = text.trim();
    if (!tag) return;

    const currentTags = credentials.hobbies || [];

    if (currentTags.includes(tag.toLowerCase())) {
      Alert.alert('Duplicate', 'You already added this hobby.');
      setText('');
      return;
    }

    if (currentTags.length >= MAX_TAGS) {
      Alert.alert('Limit Reached', `Max ${MAX_TAGS} hobbies allowed.`);
      setText('');
      return;
    }

    const updated = [...currentTags, tag];
    setCredentials({ ...credentials, hobbies: updated });
    setText('');
  };

  const removeTag = (tag: string) => {
    const updated = credentials.hobbies?.filter((t) => t !== tag) || [];
    setCredentials({ ...credentials, hobbies: updated });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsWrapper}>
        {(credentials.hobbies || []).map((tag, index) => (
          <TouchableOpacity key={`${tag}-${index}`} onPress={() => removeTag(tag)} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a hobby"
        onSubmitEditing={addTag}
        returnKeyType="done"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 10,
    color: '#333',
    fontFamily : FONT.medium,
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 2,
    borderColor: PRIMARY,
    padding: 10,
    width : "140%",
    borderRadius: 6,
    backgroundColor: 'white',
    fontSize: 14,
    color: '#000',
    fontFamily : FONT.medium,
    marginBottom: 10
  },
});
