import Button from '@/components/Button';
import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { IUser } from '@/interfaces/user.interface';
import { removeValue } from '@/libs/asyncStorage.libs';
import { useUserStore } from '@/store/user.store';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface IProps {
  profile: IUser;
}

const ProfileScreen: React.FC<IProps> = ({ profile }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { setUser } = useUserStore();

  const router = useRouter();

  const handleLogout = () => {
    console.log('logging out');
    setLoading(true);

    removeValue('user_token');
    setUser(null);

    setLoading(false);
    router.replace('/login');
  };
  return (
    <ScrollView
      className="bg-white flex-1"
      contentContainerStyle={{
        paddingBottom: hp(5),
      }}
    >
      {/* Profile Image */}
      <View>
        <Image
          source={{ uri: profile.profilePic || dummyPfp }}
          style={{
            width: wp(100),
            height: hp(60),
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />
      </View>

      {/* Info Section */}
      <View className=" mt-6 space-y-6">
        {/* Name + Edit Button */}
        <View className="flex-row px-3 justify-between items-center">
          <Text
            className="text-2xl font-bold text-black"
            style={{ fontSize: hp(3), fontFamily: FONT.bold }}
          >
            {profile.firstName} {profile.lastName}
            <Text
              style={{ fontFamily: FONT.semiBold }}
              className="text-lg text-neutral-600"
            >
              , {profile.age}
            </Text>
          </Text>

          <View
            className="bg-black/10  rounded-full items-center justify-center"
            style={{ height: hp(5), width: hp(5) }}
          >
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile/edit')}
            >
              <FontAwesome5
                name="user-edit"
                size={25}
                strokeWidth={2}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hobbies */}
        <View className="flex-row flex-wrap px-3 space-x-2">
          <Text
            style={{ fontFamily: FONT.semiBold }}
            className="uppercase font-semibold text-gray-500 mb-2  "
          >
            Interests :
          </Text>
          <View className=" flex-row" style={{ marginLeft: hp(1) }}>
            {profile.hobbies?.map((hobby, index) => (
              <View
                key={index}
                className="bg-gray-300 items-center justify-center  px-4 py-1 mr-2 mb-2 rounded-full shadow-sm"
                style={{
                  backgroundColor: '#d1d5db',
                  borderRadius: 50,
                  height: hp(2.7),
                }}
              >
                <Text
                  style={{ fontFamily: FONT.medium }}
                  className="text-black text-sm capitalize"
                >
                  {hobby}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bio Section */}
        <View className="bg-gray-100 p-4 rounded-xl shadow-sm px-3">
          <Text
            style={{ fontFamily: FONT.semiBold }}
            className="uppercase font-semibold text-gray-500 mb-2"
          >
            Bio
          </Text>
          <Text
            style={{ fontFamily: FONT.medium }}
            className="text-black text-sm leading-relaxed"
          >
            {profile.bio}
          </Text>
        </View>
      </View>

      <View className="w-full mb-3 mt-6 justify-center items-center">
        <Button
          title="log out"
          onPressHandler={handleLogout}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
