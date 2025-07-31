import BackButton from '@/components/BackButton';
import MessageBox from '@/components/MessageBox';
import { BASE_URI } from '@/constants/api';
import { FONT } from '@/constants/fonts.constant';
import { PRIMARY, SECONDARY } from '@/constants/myColor';
import { IMessage } from '@/interfaces/message.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { uploadToCloudinary } from '@/libs/cloudinary';
import { getToast } from '@/libs/Toast.libs';
import { sendMessageSchema } from '@/schemas/messageSchema';
import { useUserStore } from '@/store/user.store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

type ImessageType = 'text' | 'image' | 'video';

interface IProps {
  messages: IMessage[];
  participantData: IParticipantData;
  chatRoomId: string;
}

interface IDataToBeSent {
  chatRoomId: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  messageType: ImessageType;
}

const ChatRoomScreen = ({ messages, participantData, chatRoomId }: IProps) => {
  const { user } = useUserStore();

  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>('');
  if (!user) return null;

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
    let dataToBeSent: IDataToBeSent;

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

    const token = await getData('user_token');
    const messageResponse = await withErrorHandler(async () => {
      return await axios.post(BASE_URI + 'message/send', dataToBeSent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })();

    if (messageResponse?.status !== 201) {
      const errorMsg =
        messageResponse?.data?.message ||
        'Message send failed. Please try again.';
      getToast('error', 'Message send failed', errorMsg);
      return;
    }

    console.log(dataToBeSent, messageResponse.data);
    setLoading(false);
    setMessageInput('');
    setImage(''); // reset the image after sending
  };

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
              <MessageBox key={item._id} message={item} />
            )}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            inverted //newest message at bottom
          />

          {/* Input Bar */}
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
              onPress={() => handleMessageSent('text')}
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
