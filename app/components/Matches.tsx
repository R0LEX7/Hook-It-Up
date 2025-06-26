import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { IUser } from '@/interfaces/user.interface';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';


interface IProps{
  matches : IUser[]
}

const Matches = ({matches} : IProps) => {
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
        {matches?.map((match, index) => (
          <TouchableOpacity
            key={match._id}
            className="flex items-center space-y-2 mx-1.5"
          >
            <View className="rounded-full">
              <Image
                source={{ uri: match.profilePic || dummyPfp }}
                style={{ height: hp(6), width: hp(6) }}
                className="rounded-full"
                resizeMode='cover'
              />
            </View>
            <Text
            style={{ fontSize: hp(1.6) , fontFamily: FONT.bold }}
              className="text-neutral-800 font-semibold"
            >

              {match.firstName}
            </Text>
            <Text style={{ fontFamily: FONT.semiBold }} className="text-neutral-800 font-semibold">{match.age}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Matches;
