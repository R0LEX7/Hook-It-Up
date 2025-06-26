import { BASE_URI } from '@/constants/api';
import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { IRequestUser } from '@/interfaces/request.interface';
import { IUser } from '@/interfaces/user.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { getToast } from '@/libs/Toast.libs';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from './Loader';

interface RequestListProps {
  user: IRequestUser;
  setRequests: React.Dispatch<React.SetStateAction<IRequestUser[]>>;
  setMatches: React.Dispatch<React.SetStateAction<IUser[]>>;
}

const RequestList = ({ user, setMatches, setRequests }: RequestListProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async (status: string) => {
    try {
      setLoading(true);
      const token = await getData('user_token');
      const res = await withErrorHandler(async () => {
        return await axios.post(
          BASE_URI + `connection/review/${status}/${user.reqId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      })();

      if (res.status === 200) {
        setRequests((prev) => prev.filter((u) => u._id !== user._id));
        if (status === 'accepted') setMatches((prev) => [...prev, user]);
        const toastMessage =
          status === 'accepted'
            ? ['Your new match', user.firstName + ' ' + user.lastName]
            : [
                'You Rejected',
                user.firstName + ' ' + user.lastName + 'removed from the list',
              ];

        getToast('info', toastMessage[0], toastMessage[1]);
      } else {
        getToast('error', 'Server Error', 'Server is under maintenance');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log('req id ->', user.reqId);

  return (
    <TouchableOpacity className="w-full py-3 users-center flex-row border-b border-neutral-300">
      {/* Avatar */}
      <View
        className="w-[17%] justify-center"
        style={{
          width: hp(7),
          height: hp(7),
        }}
      >
        <Image
          source={{ uri: user.profilePic || dummyPfp }}
          style={{
            width: '90%',
            height: '90%',
          }}
          className="rounded-full"
        />
      </View>
      {/**texts data */}
      <View className="w-[82%] justify-center " style={{ height: hp(6) }}>
        <View className="flex-row justify-between users-center">
          <View className="flex-row justify-center users-center">
            <View className=" ">
              <Text style={{ fontFamily: FONT.semiBold }} className="font-semibold text-base">
                {user.firstName} {user.lastName}
              </Text>
              <Text style={{ fontFamily: FONT.bold }} className="font-semibold text-base mr-1">{user.age}</Text>
            </View>
          </View>

          {/* Accept / Reject Buttons */}
          {loading ? (
            <View>
              <Loader />
            </View>
          ) : (
            <View
              className="flex-row space-x-3 justify-evenly"
              style={{ width: hp(10) }}
            >
              <TouchableOpacity
                onPress={() => {
                  handleClick('rejected');
                }}
                className="bg-red-100 p-2 rounded-full"
              >
                <AntDesign name="close" size={20} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleClick('accepted');
                }}
                className="bg-green-100 p-2 rounded-full"
              >
                <AntDesign name="check" size={20} color="green" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RequestList;
