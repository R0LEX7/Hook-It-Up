import { PRIMARY } from '@/constants/myColor';
import { storeData } from '@/libs/asyncStorage.libs';
import { withErrorHandler } from '@/libs/errorHandler.libs';
import { getToast } from '@/libs/Toast.libs';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login: React.FC = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

const handleLogin = async () => {
  setIsLoading(true);
  try {
    await withErrorHandler(async () => {
      const res = await axios.post('http://192.168.1.4:3000/auth/login', credentials);
      const token = res.data.token;
      console.log(token);
      if (token) {
        await storeData('user_token', token);
        getToast( "success" , "Login SuccessFull " , credentials.username)
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

      <View style={{ height: 200, backgroundColor: PRIMARY, width: '100%' }}>
        <View
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
        </View>

        <Text
          style={{
            marginTop: 20,
            textAlign: 'center',
            fontSize: 20,
            fontFamily: 'GillSans-SemiBold',
          }}
        >
          HookItUp!!!
        </Text>
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginTop: 25,
              color: PRIMARY,
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: PRIMARY,
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="white"
            />

            <TextInput
              placeholder="Enter your username"
              placeholderTextColor={'white'}
              value={credentials.username}
              onChangeText={(text) =>
                setCredentials({ ...credentials, username: text })
              }
              style={{
                color: 'white',
                marginVertical: 10,
                width: 300,
                fontSize: 17,
              }}
            />
          </View>
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              backgroundColor: PRIMARY,
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="white"
            />

            <TextInput
              placeholder="Enter your password"
              secureTextEntry={true}
              placeholderTextColor={'white'}
              value={credentials.password}
              onChangeText={(text) =>
                setCredentials({ ...credentials, password: text })
              }
              style={{
                color: 'white',
                marginVertical: 10,
                width: 300,
                fontSize: 17,
              }}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>Keep me logged in</Text>

          <Text style={{ color: '#007FFF', fontWeight: '500' }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          {isLoading && <ActivityIndicator size={"large"}/>}
          <Pressable
            onPress={handleLogin}
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
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/register')}
            style={{ marginTop: 12 }}
          >
            <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
              Don&apos;t have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
