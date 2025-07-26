import Loader from '@/components/Loader';
import Matches from '@/components/Matches';
import MessageCard from '@/components/MessageCard';
import { BASE_URI } from '@/constants/api';
import { FONT } from '@/constants/fonts.constant';
import { IChat } from '@/interfaces/chat.interface';
import { IUser } from '@/interfaces/user.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { useUserStore } from '@/store/user.store';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const android = Platform.OS === 'android';

const searchData = (text: string, chatList: IChat[], userId: string): IChat[] => {
  const searchText = text.trim().toLowerCase();

  return chatList.filter((chat) => {
    const user = chat.members.find((member: IUser) => member._id !== userId);
    if (!user) return false;

    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const username = user.username.toLowerCase();

    return fullName.includes(searchText) || username.includes(searchText);
  });
};


const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableUsersToChat, setAvailableUsersToChat] = useState<IUser[]>([]);
  const [chats, setChats] = useState<IChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<IChat[]>([]);

  const {user} = useUserStore();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await getData('user_token');

        const [chatRes, matchesRes] = await Promise.all([
          withErrorHandler(() =>
            axios.get(BASE_URI + 'chat/all-chats', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          )(),
          withErrorHandler(() =>
            axios.get(BASE_URI + 'chat/available-to-chat', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          )(),
        ]);

        if (chatRes?.status === 200 && chatRes.data.count > 0) {
          setChats(chatRes.data.data);
          setFilteredChats(chatRes.data.data);
        }

        if (matchesRes?.status === 200 && matchesRes.data.count > 0) {
          setAvailableUsersToChat(matchesRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if(!user){
    return null;
  }
  const Reusable: React.FC<{ message: string }> = ({ message }) => (
    <View className=" h-2/5 w-full items-center justify-center">
      <Text
        style={{ fontFamily: FONT.semiBold }}
        className="text-neutral-800 font-semibold"
      >
        {message}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: android ? hp(6) : 0 }}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={{ flex: 1 }}>
          <View className="border-b border-neutral-300">
            <View className="px-4">
              <Text
                style={{ fontFamily: FONT.semiBold }}
                className="uppercase font-semibold text-neutral-500 tracking-wider"
              >
                Start a Chat
              </Text>
            </View>
            {availableUsersToChat.length === 0 ? (
              <Reusable message={'You have no Requests!!'} />
            ) : (
              <Matches
                users={availableUsersToChat}
                setUsers={setAvailableUsersToChat}
                type="chat"
              />
            )}
          </View>
          {/* search bar */}

          {setFilteredChats.length > 0 && (
            <View className="mx-4 mt-6 flex-row items-center rounded-2xl bg-neutral-200 px-3 ">
              <TextInput
                placeholder="Search"
                placeholderTextColor={'gray'}
                style={{ fontSize: hp(1.7), fontFamily: FONT.medium }}
                className="flex-1 text-base mb-1 pl-1 tracking-widest"
                onChangeText={(text) => {
                  const filteredData = searchData(text , chats , user._id);
                  console.log("query " , text , "filteredUser " , filteredData);
                  setFilteredChats(filteredData);

                }}
              />
              <View>
                <AntDesign name="search1" size={hp(2.5)} color="gray" />
              </View>
            </View>
          )}

          {/* request list */}
          <View style={{ flex: 1 }} className="px-4">
            <View className=" py-4">
              <Text
                style={{ fontFamily: FONT.semiBold }}
                className="uppercase font-semibold text-neutral-500 tracking-wider"
              >
                Chats
              </Text>
            </View>

            {setFilteredChats.length === 0 ? (
              <Reusable message={'You have no Chats!!'} />
            ) : (
              <FlatList
                data={filteredChats}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <MessageCard
                    chat={item}
                    handleClick={() =>
                      console.log('chatroom id clicked', item._id)
                    }
                  />
                )}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;
