import InputField from '@/components/Input';
import { BASE_URI } from '@/constants/api';
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
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

 interface IRegisterUser {
  username: string;
  lastName: string;
  firstName: string;
  age:  number;
  password: string;
  hobbies ?:string[],
  profilePic ?: string
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

  const handleRegister = async () => {
    setIsLoading(true);

    console.log('click');

    const userCredentials : IRegisterUser = { ...credentials, age: Number(credentials.age) };

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
        style={{ alignItems: 'center', height: 100, marginTop: 30 }}
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
            }}
          >
            Create your Account
          </Text>
        </View>

        <View>
          <InputField
            placeholder="Enter your Firstname*"
            placeholderTextColor={SECONDARY}
            value={credentials.firstName}
            onChangeText={(text: string) =>
              setCredentials({ ...credentials, firstName: text })
            }
          />
          {formErrors.firstName && (
            <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
              {formErrors.firstName}
            </Text>
          )}
        </View>

        <View>
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

        <View>
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

        <View>
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

        <View>
          <InputField
            placeholder="Enter your Password*"
            placeholderTextColor={SECONDARY}
            secureTextEntry={true}
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

        <View style={{ marginTop: 25  }}>
          <Pressable
            onPress={handleRegister}
            // disabled={isLoading}
            style={{
              width : 300,
              backgroundColor: PRIMARY,
              borderRadius: 6,
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              {isLoading ? 'Welcoming you..' : 'Register'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
                marginVertical: 10,
              }}
            >
              Already have an account?
              <Text style={{ color: PRIMARY , marginHorizontal: 8}}>Log in?</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
