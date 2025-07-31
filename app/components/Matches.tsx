import { BASE_URI } from '@/constants/api';
import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { IUser } from '@/interfaces/user.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { useUserStore } from '@/store/user.store';
import Entypo from '@expo/vector-icons/Entypo';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface IProps {
  users: IUser[];
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  type: 'match' | 'chat';
}

const Matches = ({ users, setUsers, type }: IProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useUserStore();

  const createChat = async (participantId: string) => {
    setIsLoading(true);
    const token = await getData('user_token');
    const response = await withErrorHandler(
      async () =>
        await axios.post(
          BASE_URI + 'chat/create-chat',
          { memberIds: [user?._id, participantId] },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
    )();

    if (response?.status === 201 || response?.status === 200) {
      console.log(response.data.data);
      if (type === 'chat')
        setUsers((prevUsers: IUser[]) =>
          prevUsers.filter((p) => p._id !== participantId),
        );
      router.push({
        pathname: '/(tabs)/chat/[chatRoomId]',
        params: { chatRoomId: response.data.data._id },
      });
    } else {
      console.log(response);
    }
    setIsLoading(false);
  };
  return (
    <View className="mt-4 mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className=" "
        contentContainerStyle={{
          paddingHorizontal: hp(2),
        }}
      >
        {users?.map((match, index) => (
          <Pressable
            key={match._id}
            className="flex items-center space-y-2 mx-1.5"
            onPress={() => {
              if (type === 'chat') {
                createChat(match._id);
              }
            }}
          >
            <View
              className="rounded-full relative"
              style={{ height: hp(7.5), width: hp(7.5) }}
            >
              <Image
                source={{ uri: match.profilePic || dummyPfp }}
                style={{ height: hp(7.2), width: hp(7.2) }}
                className="rounded-full"
                resizeMode="cover"
              />
              {type === 'chat' && (
                <Entypo
                  className="absolute bottom-0 right-0 bg-neutral-100 rounded-full"
                  name="plus"
                  size={20}
                  color="black"
                />
              )}
            </View>
            <Text
              style={{ fontSize: hp(1.6), fontFamily: FONT.bold }}
              className="text-neutral-800 font-semibold"
            >
              {match.firstName}
            </Text>
            <Text
              style={{ fontFamily: FONT.semiBold }}
              className="text-neutral-800 font-semibold"
            >
              {match.age}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Matches;
