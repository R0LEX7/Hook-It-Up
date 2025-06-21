import InputField from '@/components/Input';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { withErrorHandler } from '@/libs/errorHandler.libs';
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

const Register: React.FC = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    lastName: '',
    firstName: '',
    age: 0,
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

  try {
    await withErrorHandler(async () => {
      const res = await axios.post('http://192.168.1.4:3000/auth/signup', credentials);

      console.log('Signup response:', res);
      if (res.status === 201 || res.data?.success) {

        router.replace('/(auth)/login');
      } else {
        console.warn('Signup failed:', res.data?.message || 'Unknown error');
      }
    })();
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
            placeholder="Enter your Age*"
            placeholderTextColor={SECONDARY}
            keyboardType="numeric"
            onChangeText={(text: string) =>
              setCredentials({ ...credentials, age: Number(text) })
            }
            value={String(credentials.age)}
            maxLength={2}
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

        <View style={{ marginTop: 50 }}>
          <Pressable
            onPress={handleRegister}
            disabled={isLoading}
            style={{
              width: 200,
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
                marginBlock: 10,
              }}
            >
              Already have an account?{' '}
              <Text style={{ color: PRIMARY }}>Log in?</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
