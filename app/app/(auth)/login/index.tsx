import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import InputField from '@/components/Input';
import { BASE_URI } from '@/constants/api';
import { FONT } from '@/constants/fonts.constant';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { storeData } from '@/libs/asyncStorage.libs';
import { withErrorHandler } from '@/libs/errorHandler.libs';
import { getToast } from '@/libs/Toast.libs';
import { loginSchema } from '@/schemas/auth.schema';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login: React.FC = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
  });

  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLoading(true);

    /* form validation*/
    const validation = loginSchema.safeParse(credentials);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors({
        username: fieldErrors.username?.[0] || '',
        password: fieldErrors.password?.[0] || '',
      });

      setIsLoading(false);
      return;
    }

    try {
      const res: any = await withErrorHandler(async () => {
        return await axios.post(BASE_URI + 'auth/login', credentials);
      })();

      console.log('res ', res);

      if (res?.status === 200 && res.data?.token) {
        const token = res.data.token;
        await storeData('user_token', token);
        getToast(
          'success',
          'Login Successful',
          `${credentials.username} welcome to HookItUp`,
        );
        router.replace('/(tabs)/explore');
      } else {
        const errorMsg = res?.data.message || 'Login failed. Please try again.';
        getToast('error', 'Login Failed', errorMsg);
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

      <View style={{ height: 200, width: '100%' }}>
        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25,
          }}
        >
          <Image
            style={{ width: 150, height: 80, resizeMode: 'contain' }}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/128/6655/6655045.png',
            }}
          />
        </View> */}

        <Text
          style={{
            marginTop: 30,
            textAlign: 'center',
            fontSize: 20,
            fontFamily: FONT.medium,
          }}
          className="tracking-widest"
        >
          HookItUp!!!
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ alignItems: 'center', height: 100, marginTop: 23, flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginTop: 25,
              color: PRIMARY,
              fontFamily: FONT.medium,
            }}
          >
            Log in to your Account
          </Text>
        </View>

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

        <View style={{ marginTop: 20 }}>
          <View className="mt-4">
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
        </View>

        <View>
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
          </View>
          <CheckBox
            title="show password"
            isChecked={!hidePassword}
            onPressHandler={() => setHidePassword(!hidePassword)}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <Button
            onPressHandler={handleLogin}
            loading={isLoading}
            title={isLoading ? 'Logging in...' : 'Login'}
          />

          <Pressable
            onPress={() => router.replace('/register')}
            style={{ marginTop: 12 }}
          >
            <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
              Don&apos;t have an account?{' '}
              <Text style={{ color: PRIMARY }}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
