import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import InputField from '@/components/Input';
import { BASE_URI } from '@/constants/api';
import { FONT } from '@/constants/fonts.constant';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { withErrorHandler } from '@/libs/errorHandler.libs';
import { getToast } from '@/libs/Toast.libs';
import { registerSchema } from '@/schemas/auth.schema';
import axios from 'axios';
import { useRouter } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IRegisterUser {
  username: string;
  lastName: string;
  firstName: string;
  age: number;
  password: string;
  hobbies?: string[];
  profilePic?: string;
}

const Register: React.FC = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    lastName: '',
    firstName: '',
    age: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    age: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const handleRegister = async () => {
    setIsLoading(true);

    console.log('click');

    const userCredentials: IRegisterUser = {
      ...credentials,
      age: Number(credentials.age),
    };

    /* form validation*/
    const validation = registerSchema.safeParse(userCredentials);

    if (!validation.success) {
      console.log('Validation failed:', validation?.error.flatten());
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors({
        firstName: fieldErrors.firstName?.[0] || '',
        lastName: fieldErrors.lastName?.[0] || '',
        username: fieldErrors.username?.[0] || '',
        age: fieldErrors.age?.[0] || '',
        password: fieldErrors.password?.[0] || '',
      });

      setIsLoading(false);
      return;
    }

    try {
      const res: any = await withErrorHandler(async () => {
        return await axios.post(BASE_URI + 'auth/signup', userCredentials);
      })();

      console.log('res ', res);

      if (res?.status === 201) {
        getToast(
          'success',
          'Signup Successful',
          `${credentials.username} Kindly Login to HookItUp`,
        );
        router.replace('/(auth)/login');
      } else {
        const errorMsg = res?.message || 'Register failed. Please try again.';
        getToast('error', 'Register Failed', errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}
      edges={['top']}
    >
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            paddingTop: 23,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Image
              style={{ width: 100, height: 80, resizeMode: 'cover' }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/2509/2509078.png',
              }}
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: 'bold',
                marginTop: 25,
                color: PRIMARY,
                fontFamily: FONT.semiBold,
              }}
            >
              Create your Account
            </Text>
          </View>

          <View className="mt-10">
            <InputField
              placeholder="Enter your Firstname*"
              placeholderTextColor={SECONDARY}
              value={credentials.firstName}
              onChangeText={(text: string) =>
                setCredentials({ ...credentials, firstName: text })
              }
            />
            {formErrors.firstName && (
              <Text
                style={{
                  color: 'red',
                  fontSize: 14,
                  marginInline: 6,
                  fontFamily: FONT.medium,
                }}
              >
                {formErrors.firstName}
              </Text>
            )}
          </View>

          <View className="mt-6">
            <InputField
              placeholder="Enter your Lastname*"
              placeholderTextColor={SECONDARY}
              value={credentials.lastName}
              onChangeText={(text: string) =>
                setCredentials({ ...credentials, lastName: text })
              }
            />
            {formErrors.lastName && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.lastName}
              </Text>
            )}
          </View>

          <View className="mt-6">
            <InputField
              placeholder="Enter your Username*"
              placeholderTextColor={SECONDARY}
              value={credentials.username}
              onChangeText={(text: string) =>
                setCredentials({ ...credentials, username: text })
              }
            />
            {formErrors.username && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.username}
              </Text>
            )}
          </View>

          <View className="mt-6">
            <InputField
              placeholder="Enter your Age (e.g. 18)*"
              placeholderTextColor={SECONDARY}
              keyboardType="numeric"
              maxLength={2}
              value={credentials.age}
              onChangeText={(text: string) => {
                // Allow only digits and block everything else
                if (/^\d{0,2}$/.test(text)) {
                  setCredentials({ ...credentials, age: text });
                }
              }}
            />
            {formErrors.age && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.age}
              </Text>
            )}
          </View>

          <View className="mt-6">
            <InputField
              placeholder="Enter your Password*"
              placeholderTextColor={SECONDARY}
              secureTextEntry={hidePassword}
              value={credentials.password}
              onChangeText={(text: string) =>
                setCredentials({ ...credentials, password: text })
              }
            />
            {formErrors.password && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.password}
              </Text>
            )}
            <CheckBox
              title="show password"
              isChecked={!hidePassword}
              onPressHandler={() => setHidePassword(!hidePassword)}
            />
          </View>

          <View style={{ marginTop: 25 }}>
            <Button
              loading={isLoading}
              onPressHandler={handleRegister}
              title={isLoading ? 'Welcoming you..' : 'Register'}
            />

            <Pressable
              onPress={() => router.replace('/(auth)/login')}
              className="flex flex-row justify-center"
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: 'gray',
                  fontSize: 16,
                  marginVertical: 10,
                  fontFamily: FONT.medium,
                }}
              >
                Already have an account?
              </Text>
              <Text
                style={{
                  color: PRIMARY,
                  marginHorizontal: 8,
                  fontWeight: 500,
                  marginVertical: 10,
                  fontFamily: FONT.semiBold,
                }}
                className="mx-3"
              >
                Log in?
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
