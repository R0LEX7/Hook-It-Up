import Loader from '@/components/Loader';
import Matches from '@/components/Matches';
import RequestCard from '@/components/RequestCard';
import { BASE_URI } from '@/constants/api';
import { FONT } from '@/constants/fonts.constant';
import { IRequestUser } from '@/interfaces/request.interface';
import { IUser } from '@/interfaces/user.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
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

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<IRequestUser[]>([]);
  const [matches, setMatches] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = await getData('user_token');

        const [requestsRes, matchesRes] = await Promise.all([
          withErrorHandler(() =>
            axios.get(BASE_URI + 'connection/requests', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          )(),
          withErrorHandler(() =>
            axios.get(BASE_URI + 'connection/all_connections', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          )(),
        ]);

        if (requestsRes?.status === 200 && requestsRes.data.count > 0) {
          setRequests(requestsRes.data.requests);
        }

        if (matchesRes?.status === 200 && matchesRes.data.count > 0) {
          setMatches(matchesRes.data.matches);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('matches ', matches);

  const Reusable: React.FC<{ message: string }> = ({ message }) => (
    <View className=" h-2/5 w-full items-center justify-center">
      <Text style={{ fontFamily: FONT.semiBold }} className="text-neutral-800 font-semibold">{message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: android ? hp(5) : 0 }}>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={{ flex: 1 }}>
          <View className="border-b border-neutral-300">
            <View className="px-4">
              <Text  style={{ fontFamily: FONT.semiBold }} className="uppercase font-semibold text-neutral-500 tracking-wider">
                Matches
              </Text>
            </View>
            {matches.length === 0 ? (
              <Reusable message={'You have no Requests!!'} />
            ) : (
              <Matches matches={matches} />
            )}
          </View>
          {/* search bar */}

          {requests.length > 0 && (
            <View className="mx-4 mt-6 flex-row items-center rounded-2xl bg-neutral-200 px-3 py-2">
              <TextInput
                placeholder="Search"
                placeholderTextColor={'gray'}
                style={{ fontSize: hp(1.7) , fontFamily: FONT.medium }}
                className="flex-1 text-base mb-1 pl-1 tracking-widest"
              />
              <View>
                <AntDesign name="search1" size={hp(2.5)} color="gray" />
              </View>
            </View>
          )}

          {/* request list */}
          <View style={{ flex: 1 }} className="px-4">
            <View className=" py-4">
              <Text style={{ fontFamily: FONT.semiBold }} className="uppercase font-semibold text-neutral-500 tracking-wider">
                Requests
              </Text>
            </View>

            {requests.length === 0 ? (
              <Reusable message={'You have no Requests!!'} />
            ) : (
              <FlatList
                data={requests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <RequestCard
                    user={item}
                    setRequests={setRequests}
                    setMatches={setMatches}
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
