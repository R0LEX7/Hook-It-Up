import AsyncStorage from '@react-native-async-storage/async-storage';
import { withErrorHandler } from './errorHandler.libs';

export const storeData =
  withErrorHandler((key: string, value: string) => AsyncStorage.setItem(key, value));

export const getData = withErrorHandler(async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value;
});

export const removeValue = withErrorHandler((key: string) =>
  AsyncStorage.removeItem(key),
);
