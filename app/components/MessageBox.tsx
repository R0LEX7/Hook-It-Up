import { IMessage } from '@/interfaces/message.interface';
import { getToast } from '@/libs/Toast.libs';
import { useUserStore } from '@/store/user.store';
import { formatMessageTime } from '@/utils/formateDate.utils';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import ImageViewing from 'react-native-image-viewing';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface IProps {
  message: IMessage;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  handleDelete: (messageId: string) => void;
}

const MessageBox = ({
  message,
  setSelectedMessageId,
  setIsEditing,
  setMessageInput,
  handleDelete,
}: IProps) => {
  const { user } = useUserStore();

  const navigation = useNavigation();

  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      SheetManager.hide('message-options'); //hide by sheet ID
      // or if  use ref: sheetRef.current?.hide();
    });

    return unsubscribe;
  }, [navigation]);

  const handleCopy = () => {
    if (!message.text) return;
    Clipboard.setStringAsync(message.text);
    getToast('success', 'Message copied!');
  };

  if (!user) return null;
  const isSenderIsUser = message.senderId?._id === user._id;

  const onMessageLongPress = async () => {
    if (message.messageType !== 'text' || message.isDeleted || !isSenderIsUser)
      return;
    setSelectedMessageId(message._id);
    await SheetManager.show('message-options', {
      payload: {
        onEdit: () => {
          setMessageInput(message.text || '');
          setIsEditing(true);
        },
        onDelete: () => handleDelete(message._id),
        onCopy: () => handleCopy(),
      },
    });
  };

  return (
    <Pressable
      style={{
        flexDirection: isSenderIsUser ? 'row-reverse' : 'row',
        padding: 3,
        paddingVertical: 3,
      }}
      onLongPress={onMessageLongPress}
      delayLongPress={300}
    >
      <View style={{ width: 'auto', maxWidth: wp(70) }}>
        {message.isEdited && (
          <Text
            className={`text-xs text-sky-400 ${isSenderIsUser ? 'text-right' : 'text-left'} px-[8px] `}
          >
            Edited
          </Text>
        )}
        {message.messageType === 'text' ? (
          <View
            style={{
              borderBottomRightRadius: isSenderIsUser ? 0 : 10,
              borderBottomLeftRadius: isSenderIsUser ? 10 : 0,
              backgroundColor: message.isDeleted
                ? '#FAF9F6'
                : isSenderIsUser
                  ? '#FAF9F6'
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

                flexWrap: 'wrap',
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
              <Pressable onPress={() => setIsImageOpen(true)}>
                <Image
                  source={{ uri: message.mediaUrl }}
                  style={{
                    height: 200,
                    width: 200,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              </Pressable>
            )}
          </View>
        )}

        <ImageViewing
          images={[{ uri: message.mediaUrl }]}
          imageIndex={0}
          visible={isImageOpen}
          onRequestClose={() => setIsImageOpen(false)}
          presentationStyle="fullScreen"
        />
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
