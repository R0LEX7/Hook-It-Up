import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import { HobbiesInput } from '@/components/HobbiesInput';
import InputField from '@/components/Input';
import PreviewModal from '@/components/PreviewModal';
import { BASE_URI } from '@/constants/api';
import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { IUser } from '@/interfaces/user.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { uploadToCloudinary } from '@/libs/cloudinary';
import { getToast } from '@/libs/Toast.libs';
import { profileSchema } from '@/schemas/profile.schema';
import { useUserStore } from '@/store/user.store';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IProps {
  user: IUser;
}

const Register = ({ user }: IProps) => {
  const router = useRouter();

  const { setUser } = useUserStore();

  const [credentials, setCredentials] = useState(user);

  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    age: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(user.profilePic || null);
  const [preview, setPreview] = useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const handleEditProfile = async () => {
    setIsLoading(true);

    console.log('click');

    const userCredentials = {
      ...credentials,
      age: Number(credentials.age),
    };

    /* form validation*/
    const validation = profileSchema.safeParse(userCredentials);

    if (!validation.success) {
      console.log('Validation failed:', validation?.error.flatten());
      const fieldErrors = validation.error.flatten().fieldErrors;
      setFormErrors({
        firstName: fieldErrors.firstName?.[0] || '',
        lastName: fieldErrors.lastName?.[0] || '',
        age: fieldErrors.age?.[0] || '',
        bio: fieldErrors.bio?.[0] || '',
      });

      setIsLoading(false);
      return;
    }

    let formdata = {};
    console.log('credentials-> ', credentials);
    Object.keys(credentials).forEach((key) => {
      if (credentials[key] !== user[key]) {
        formdata = { ...formdata, [key]: credentials[key] };
      }
    });

    try {
      if (image && image !== user.profilePic) {
        const uploadedImageUrl = await uploadToCloudinary(image);
        formdata = { ...formdata, profilePic: uploadedImageUrl };
      }
      console.log('formData -> ', formdata);
      const token = await getData('user_token');
      const res: any = await withErrorHandler(async () => {
        return await axios.post(BASE_URI + 'profile/edit', formdata, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })();

      console.log('res ', res);

      if (res?.status === 200) {
        setUser(res?.data?.user);
        getToast(
          'success',
          'Profile Edited Successfully',
          `${credentials.username} Your profile is updated`,
        );
        router.replace('/(tabs)/profile');
      } else {
        const errorMsg =
          res?.message || 'Profile update failed. Please try again.';
        getToast('error', 'Profile update failed', errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setPreview(selectedImage.uri); // for display
      setImage(`data:image/jpeg;base64,${selectedImage.base64}`);
      setOpen(true);
      console.log(result.assets[0].uri);
    }
  };

  const Caption = ({ title }: { title: string }) => (
    <Text
      className={`text-xs italic `}
      style={{
        fontSize: 12,
        fontFamily: FONT.medium,
        fontStyle: 'italic',
        color: SECONDARY,
        marginHorizontal: 4,
      }}
    >
      {title}
    </Text>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}
      edges={['top']}
    >
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ alignItems: 'center', height: 100, marginTop: 23, flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {preview && open && (
          <PreviewModal
            uri={preview}
            visible={open}
            onClose={() => setOpen(false)}
            onCancel={() => {
              setImage(null);
              setOpen(false);
            }}
          />
        )}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="relative"
        >
          <BackButton />
          <View style={{ alignItems: 'center' }} className="mb-4">
            <Text
              style={{
                fontSize: 17,
                fontWeight: 'bold',
                marginTop: 25,
                color: PRIMARY,
                fontFamily: FONT.semiBold,
              }}
            >
              Edit your Profile
            </Text>
          </View>
          <View className="rounded-full mb-4 items-center">
            <Image
              source={{ uri: image || dummyPfp }}
              style={{ height: hp(6), width: hp(6) }}
              className="rounded-full"
              resizeMode="cover"
            />
          </View>
          <View style={{ alignItems: 'center' }} className="mb-4">
            <Button title="Pick Profile Image" onPressHandler={pickImage} />
          </View>
          <View className="mb-4">
            <Caption title="firstname" />
            <InputField
              placeholder="Enter your Firstname*"
              placeholderTextColor={SECONDARY}
              value={credentials.firstName}
              onChangeText={(text: string) =>
                setCredentials({
                  ...credentials,
                  firstName: text.toLowerCase(),
                })
              }
            />
            {formErrors.firstName && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.firstName}
              </Text>
            )}
          </View>
          <View className="mb-4">
            <Caption title="Lastname" />
            <InputField
              placeholder="Enter your Lastname*"
              placeholderTextColor={SECONDARY}
              value={credentials.lastName}
              onChangeText={(text: string) =>
                setCredentials({ ...credentials, lastName: text.toLowerCase() })
              }
            />
            {formErrors.lastName && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.lastName}
              </Text>
            )}
          </View>
          <View className="mb-4">
            <Caption title="Bio" />
            <InputField
              placeholder="Enter your Bio"
              placeholderTextColor={SECONDARY}
              value={credentials.bio}
              onChangeText={(text: string) =>
                setCredentials({ ...credentials, bio: text.toLowerCase() })
              }
            />
            {formErrors.bio && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.bio}
              </Text>
            )}
          </View>
          <View className="mb-4">
            <Caption title="Age" />
            <InputField
              placeholder="Enter your Age (e.g. 18)*"
              placeholderTextColor={SECONDARY}
              keyboardType="numeric"
              maxLength={2}
              value={String(credentials.age)}
              onChangeText={(text) => {
                // Allow only digits and block everything else
                if (/^\d{0,2}$/.test(text)) {
                  setCredentials({ ...credentials, age: Number(text) });
                }
              }}
            />
            {formErrors.age && (
              <Text style={{ color: 'red', fontSize: 14, marginInline: 6 }}>
                {formErrors.age}
              </Text>
            )}
          </View>
          <View
            className="flex-row items-center border-2 rounded-md  w-[300px] px-4"
            style={{ borderColor: PRIMARY }}
          >
            <HobbiesInput
              credentials={credentials}
              setCredentials={setCredentials}
            />
          </View>
          <View style={{ marginTop: 25 }}>
            <Button
              loading={isLoading}
              onPressHandler={handleEditProfile}
              title={isLoading ? 'Editing profile..' : 'Edit Profile'}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
