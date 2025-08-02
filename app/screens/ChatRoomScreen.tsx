import BackButton from '@/components/BackButton';
import MessageBox from '@/components/MessageBox';
import { BASE_URI } from '@/constants/api';
import { FONT } from '@/constants/fonts.constant';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { IMessage, IMessageDataToBeSent } from '@/interfaces/message.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { uploadToCloudinary } from '@/libs/cloudinary';
import { socket } from '@/libs/socket.libs';
import { getToast } from '@/libs/Toast.libs';
import { sendMessageSchema } from '@/schemas/messageSchema';
import { handleSendMessageService } from '@/services/message.service';
import { useUserStore } from '@/store/user.store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IParticipantData {
  username: string;
  profilePic: string;
  fullName: string;
}
interface IResponse {
  data: IMessage;
  success: boolean;
  message: string;
}

type ImessageType = 'text' | 'image' | 'video';

interface IProps {
  messages: IMessage[];
  participantData: IParticipantData;
  chatRoomId: string;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
}

const editMessageHelper = withErrorHandler(
  async (editedMessage: string, messageId: string) => {
    const token = await getData('user_token');

    const response = await axios.put(
      BASE_URI + `message/edit`,
      { messageId: messageId, editedText: editedMessage },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response;
  },
);

const deleteMessageHelper = withErrorHandler(async (messageId: string) => {
  const token = await getData('user_token');

  const response = await axios.delete(
    BASE_URI + `message/delete/${messageId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
});

const ChatRoomScreen = ({
  messages,
  participantData,
  chatRoomId,
  setMessages,
}: IProps) => {
  const { user } = useUserStore();

  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>('');
  const [IsEditing, setIsEditing] = useState<boolean>(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_chat_room', chatRoomId);

    socket.on('disconnect', () => {
      console.log('⚠️ Socket disconnected');
    });

    return () => {
      socket.disconnect(); // Cleanup on screen unmount
    };
  }, [chatRoomId]);

  useEffect(() => {
    const handler = (res: IResponse) => {
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        getToast('error', res.message || 'Failed to receive message.');
      }
    };

    socket.on('new_message', handler);

    return () => {
      socket.off('new_message', handler);
    };
  }, [setMessages]);

  if (!user) return null;

  // function which sends message
  const handleMessageSent = async (
    messageType: ImessageType = 'text',
    mediaData?: string,
  ) => {
    if (
      (messageType === 'text' && messageInput.trim().length === 0) ||
      (messageType === 'image' && !mediaData)
    )
      return;

    setLoading(true);
    let dataToBeSent: IMessageDataToBeSent;

    if (messageType === 'text') {
      dataToBeSent = {
        chatRoomId,
        senderId: user._id,
        messageType,
        text: messageInput,
      };
    } else {
      const uploadedImageUrl = await uploadToCloudinary(mediaData!);
      console.log('uploadedImageUrl -> ', uploadedImageUrl);
      dataToBeSent = {
        chatRoomId,
        senderId: user._id,
        messageType,
        mediaUrl: uploadedImageUrl,
      };
    }
    const validation = sendMessageSchema.safeParse(dataToBeSent);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      getToast('info', `${fieldErrors.messageType}` || 'MessageType error');
      getToast('info', `${fieldErrors.text}` || 'Message text error');
      getToast('info', `${fieldErrors.mediaUrl}` || 'Message Media error');
      getToast('info', `${fieldErrors.senderId}` || 'senderId error');

      setLoading(false);
      return;
    }

    const socketRes = await handleSendMessageService(dataToBeSent, socket);

    console.log(dataToBeSent);
    setLoading(false);
    setMessageInput('');
    setImage(''); // reset the image after sending
  };

  // function which edit message
  const handleMessageEdit = async () => {
    setLoading(true);
    try {
      if (IsEditing && selectedMessageId) {
        const res = await editMessageHelper(messageInput, selectedMessageId);
        if (res.status === 200 || res.status === 201) {
          const updated = res.data.data;

          setMessages((prev) =>
            prev.map((msg) => (msg._id === updated._id ? updated : msg)),
          );

          setIsEditing(false);
          setSelectedMessageId(null);
          setMessageInput('');
        }
      }
    } catch (error) {
      console.error('Error Editing message:', error);
      getToast(
        'error',
        'Editing message Failed',
        'An unexpected error occurred.',
      );
    } finally {
      setLoading(false);
    }
  };

  // delete message function
  const handleDelete = async (messageId: string) => {
    console.log('selectedMessageId ', messageId);
    if (messageId) {
      try {
        const res = await deleteMessageHelper(messageId);
        setLoading(true);
        if (res?.status === 200 || res?.status === 201) {
          const deleted = res.data.data;
          setMessages((prev) =>
            prev.map((msg) => (msg._id === deleted._id ? deleted : msg)),
          );
          console.log(res.data.data);
        }
      } catch (err) {
        console.log('Error in deleting message:', err);
        getToast('error', 'Error in deleting message:');
      } finally {
        setLoading(false);
      }
    }
  };
  // function to pick image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const selectedImage = result.assets[0];
      if (!selectedImage.base64) {
        getToast('error', 'Image selection failed', 'Base64 data missing');
        return;
      }

      const base64Image = `data:image/jpeg;base64,${selectedImage.base64}`;
      setImage(base64Image);
      console.log('Image URI:', selectedImage.uri);

      await handleMessageSent('image', base64Image); // Pass image directly
    } catch (error) {
      console.error('Error picking image:', error);
      getToast(
        'error',
        'Failed to pick image',
        'An unexpected error occurred.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'white' }}
        edges={['top']}
      >
        <StatusBar hidden />

        {/* Header */}
        <View
          style={{
            width: wp(100),
            borderBottomWidth: 1,
            borderBottomColor: SECONDARY,
            height: wp(13),
          }}
        >
          <BackButton />
          <View
            className="rounded-full"
            style={{
              flex: 1,
              flexDirection: 'row',
              gap: 16,
              alignItems: 'center',
              width: wp(80),
              justifyContent: 'center',
              paddingBottom: 13,
            }}
          >
            <Image
              source={{ uri: participantData.profilePic }}
              style={{ height: hp(5), width: hp(5) }}
              className="rounded-full"
              resizeMode="cover"
            />
            <View className=" py-1">
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: PRIMARY,
                  textAlign: 'center',
                  fontFamily: FONT.semiBold,
                }}
              >
                {participantData.fullName}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: SECONDARY,
                  textAlign: 'center',
                  fontFamily: FONT.semiBold,
                }}
              >
                {participantData.username}
              </Text>
            </View>
          </View>
        </View>

        {/* Body Section (FlatList + Input) */}
        <View style={{ flex: 1, width: wp(100), paddingHorizontal: wp(2.5) }}>
          {/* Messages */}
          <FlatList
            data={[...messages].reverse()}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <MessageBox
                key={item._id}
                message={item}
                setIsEditing={setIsEditing}
                setSelectedMessageId={setSelectedMessageId}
                setMessageInput={setMessageInput}
                handleDelete={handleDelete}
              />
            )}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            inverted //newest message at bottom
          />

          {/* Input Bar */}
          {IsEditing && (
            <View style={{ paddingTop: 8, paddingHorizontal: 8 }}>
              <Text style={{ color: 'gray', fontFamily: FONT.medium }}>
                Editing message........{' '}
                <Text
                  style={{ color: 'red' }}
                  onPress={() => {
                    setIsEditing(false);
                    setSelectedMessageId(null);
                    setMessageInput('');
                  }}
                >
                  Cancel
                </Text>
              </Text>
            </View>
          )}
          <View className="flex-row justify-between items-center w-full px-2 py-3 bg-white">
            <View className="flex-row items-center rounded-2xl bg-neutral-200 px-3 py-2 flex-1">
              <TextInput
                placeholder="Write your message here"
                placeholderTextColor={'gray'}
                inputMode="text"
                style={{
                  fontSize: hp(1.7),
                  fontFamily: FONT.medium,
                }}
                className="flex-1 text-base pl-1 tracking-wider"
                value={messageInput}
                onChangeText={(text) => setMessageInput(String(text))}
              />
              <Pressable
                className="flex-row justify-center items-center space-x-1"
                onPress={pickImage}
              >
                <MaterialIcons name="add-to-photos" size={24} color="black" />
                {/* <FaceSmileIcon size={hp(2.5)} color={"gray"} strokeWidth={2} /> */}
              </Pressable>
            </View>

            <Pressable
              style={{
                backgroundColor: 'black',
                width: wp(13),
                borderRadius: 10,
                paddingVertical: 10,
                marginInline: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                if (IsEditing) handleMessageEdit();
                else handleMessageSent('text');
              }}
            >
              {loading ? (
                <ActivityIndicator size={28} color={'white'} />
              ) : (
                <Octicons name="paper-airplane" size={26} color="white" />
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
