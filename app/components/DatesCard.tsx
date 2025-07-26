import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { IUser } from '@/interfaces/user.interface';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import React, { memo } from 'react';
import {
  Dimensions,
  Image,
  Text,
  View
} from 'react-native';

let { width, height } = Dimensions.get('window');

interface IProps {
  date: IUser;
}

const DatesCard = memo(({ date}: IProps) => {
  if (!date) return null;

  const getHobbie = () => {
    let hobbies = '';
    if (date.hobbies && date?.hobbies[0]) hobbies += date?.hobbies[0];
    if (date.hobbies && date?.hobbies.length > 1)
      hobbies += ', ' + date?.hobbies[1];

    return hobbies;
  };

  return (
    <View className="relative rounded-3xl" style={{ backgroundColor: 'white' }}>
      <View>
        <Image
          source={{ uri: date.profilePic || dummyPfp }}
          style={{ height: height * 0.7 }}
          resizeMode="cover"
          className="rounded-3xl"
        />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        className="w-full"
        style={{
          position: 'absolute',
          bottom: 0,
          height: '100%',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View className="absolute bottom-10 justify-start w-full dates-start pl-4">
        <View className="flex-row justify-center dates-center ">
          <Text  style={{ fontFamily: FONT.bold }} className="text-2xl text-white font-semibold">
            {date.firstName} {date.lastName}
            {', '}
          </Text>
          <Text  style={{ fontFamily: FONT.bold }}  className="text-2xl text-white font-semibold mr-2">{date.age}</Text>
          <AntDesign name="heart" size={25} strokeWidth={2} color="black" />
        </View>

        {/* Location */}
        <View className="flex-col justify-center items-center ">
          <Text  style={{ fontFamily: FONT.semiBold }} className="text-lg text-white font-regular">{date.bio}</Text>
          {getHobbie().length > 0 && (
            <Text style={{ fontFamily: FONT.medium }} className=" text-neutral-300 font-regular text-base mr-2 capitalize">
              {getHobbie()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

DatesCard.displayName = 'DatesCard';

export default DatesCard;
