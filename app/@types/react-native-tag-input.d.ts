declare module 'react-native-tag-input' {
  import { Component } from 'react';
  import {
    ViewStyle,
    TextStyle,
    TextInputProps,
    StyleProp,
  } from 'react-native';

  interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    text: string;
    onChangeText: (text: string) => void;
    labelExtractor: (tag: string) => string;
    inputProps?: TextInputProps;
    tagColor?: string;
    tagTextColor?: string;
    inputDefaultWidth?: number;
    maxHeight?: number;
    tagContainerStyle?: StyleProp<ViewStyle>;
    tagTextStyle?: StyleProp<TextStyle>;
  }

  export default class TagInput extends Component<TagInputProps> {}
}
