import { dummyPfp } from '@/constants/dummy.constant';
import { FONT } from '@/constants/fonts.constant';
import { IChat } from '@/interfaces/chat.interface';
import { IUser } from '@/interfaces/user.interface';
import { useUserStore } from '@/store/user.store';
import { formatMessageTime } from '@/utils/formateDate.utils';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface IProps {
  chat: IChat;
}

const MessageCard = ({ chat }: IProps) => {
  const { user } = useUserStore();
  const router = useRouter();

  const otherUser = chat.members.find(
    (member: IUser) => member._id !== user?._id,
  );

  if (!otherUser) {
    return null;
  }

  console.log(chat.lastMessage);

  const handleClick = () =>
    router.push({
      pathname: '/(tabs)/chat/[chatRoomId]',
      params: {
        chatRoomId: chat._id,
        username: otherUser.username,
        profilePic: otherUser.profilePic,
        fullName: otherUser.firstName + ' ' + otherUser.lastName,
      },
    });

  return (
    <Pressable
      className="w-full py-3 items-center flex-row border-b border-neutral-300"
      onPress={handleClick}
    >
      {/* Avatar */}
      <View
        className="w-[17%] justify-center"
        style={{
          width: hp(7),
          height: hp(7),
        }}
      >
        <Image
          source={{ uri: otherUser.profilePic || dummyPfp }}
          style={{
            width: '90%',
            height: '90%',
          }}
          className="rounded-full"
        />
      </View>
      {/**texts data */}
      <View className="w-[82%] justify-center " style={{ height: hp(6) }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row justify-center items-center">
            <View className=" ">
              <Text
                style={{ fontFamily: FONT.semiBold }}
                className="font-semibold text-base"
              >
                {otherUser.firstName} {otherUser.lastName}, {otherUser.age}
              </Text>
            </View>
          </View>

          <Text className="text-sm tracking-tight">
            {formatMessageTime(chat.lastMessageAt)}
          </Text>
        </View>
        <View>
          <Text
            className={`text-xs ${
              chat.lastMessage
                ? chat.lastMessage.isSeen
                  ? 'font-semibold text-neutral-500'
                  : 'font-bold text-black'
                : 'font-bold text-black'
            }`}
          >
            {!chat.lastMessage
              ? 'New Chat Unlocked 🎉'
              : chat.lastMessage.isDeleted
                ? 'This message was deleted'
                : chat.lastMessage.messageType === 'text' &&
                    chat.lastMessage.text
                  ? chat.lastMessage.text.length > 45
                    ? chat.lastMessage.text.slice(0, 45) + '...'
                    : chat.lastMessage.text
                  : '📷 Media'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default MessageCard;
