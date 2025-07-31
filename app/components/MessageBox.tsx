import { IMessage } from '@/interfaces/message.interface';
import { useUserStore } from '@/store/user.store';
import { formatMessageTime } from '@/utils/formateDate.utils';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';




interface IProps {
  message: IMessage;
}

const MessageBox = ({ message }: IProps) => {
  const { user } = useUserStore();


  if (!user) return null;

  const isSenderIsUser = message.senderId?._id === user._id;

  return (
    <Pressable
      style={{
        flexDirection: isSenderIsUser ? 'row-reverse' : 'row',
        padding: 3,
        paddingVertical: 3,
      }}
    >
      <View style={{ width: 'auto', maxWidth: wp(70) }}>
        {message.messageType === 'text' ? (
          <View
            style={{
              borderBottomRightRadius: isSenderIsUser ? 0 : 10,
              borderBottomLeftRadius: isSenderIsUser ? 10 : 0,
              backgroundColor: message.isDeleted
                ? '#FAF9F6'
                : isSenderIsUser
                  ? 'FAF9F6'
                  : '#E5E5E5',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderColor: message.isDeleted ? 'red' : 'gray',
              //   borderWidth: message.isDeleted || isSenderIsUser ? 1 : 0,
              borderWidth: 1,
              borderRadius: 10,
            }}
          >
            <Text
              className=" text-base leading-5 "
              style={{
                color: message.isDeleted
                  ? 'red'
                  : isSenderIsUser
                    ? 'black'
                    : '#1F2937',

                fontWeight:
                  !isSenderIsUser && !message.isSeen && !message.isDeleted
                    ? 600
                    : 400,

                flexWrap: 'wrap'
              }}
            >
              {message.isDeleted ? 'Message is Deleted' : message.text}
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: message.isDeleted ? '#FAF9F6' : 'white',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderColor: message.isDeleted ? 'red' : 'gray',
              borderWidth: message.isDeleted ? 1 : 0,
              borderRadius: message.isDeleted ? 10 : 0,
              maxWidth: wp(70),
            }}
          >
            {message.isDeleted ? (
              <Text
                style={{
                  color: 'red',

                  fontSize: 14,
                  flexWrap: 'wrap',
                }}
              >
                Media is Deleted
              </Text>
            ) : (
              <Image
                source={{ uri: message.mediaUrl }}
                style={{
                  height: 200,
                  width: 200,
                  borderRadius: 8,
                }}
                resizeMode="cover"
              />
            )}
          </View>
        )}
        {/* seen */}
        {message.isSeen && (
          <Text
            className={`text-xs text-gray-600 ${isSenderIsUser ? 'text-right' : 'text-left'}`}
          >
            seen
          </Text>
        )}
        <Text
          className={`text-[10px] text-gray-600 ${isSenderIsUser ? 'text-right' : 'text-left'}`}
        >
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
};

export default MessageBox;
