import Loader from '@/components/Loader';
import { BASE_URI } from '@/constants/api';
import { IMessage } from '@/interfaces/message.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { getToast } from '@/libs/Toast.libs';
import { ChatRoomScreen } from '@/screens';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

const fetchData = withErrorHandler(async (id) => {
  const token = await getData('user_token');

  const response = await axios.get(BASE_URI + `message/all/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
});
const seenMessagesHelper = withErrorHandler(async (id) => {
  const token = await getData('user_token');

  const response = await axios.put(
    BASE_URI + `message/seen`,
    { chatRoomId: id },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response;
});


const toStr = (val: string | string[] | undefined): string => {
  if (Array.isArray(val)) return val[0] ?? '';
  return val ?? '';
};

export default function Index() {
  const { chatRoomId, username, fullName, profilePic } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (!chatRoomId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await fetchData(chatRoomId);
        if (res?.status === 200 || res?.status === 201) {
          setMessages(res.data?.data || []);
          console.table(res.data.data);

          // sending seen request
          await seenMessagesHelper(chatRoomId);
        }
      } catch (err) {
        console.log('Error fetching messages:', err);
        getToast('error', 'Error fetching messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatRoomId]);

  const participantData = {
    username: toStr(username),
    fullName: toStr(fullName),
    profilePic: toStr(profilePic),
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ChatRoomScreen
          chatRoomId={toStr(chatRoomId)}
          messages={messages}
          participantData={participantData}
          setMessages={setMessages}
        />
      )}
    </>
  );
}
