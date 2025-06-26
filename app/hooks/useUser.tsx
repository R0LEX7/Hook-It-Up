import { BASE_URI } from '@/constants/api';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { useUserStore } from '@/store/user.store';
import axios from 'axios';
import { useEffect, useRef } from 'react';

const useUser = () => {
  const { user, setUser, setLoading, isLoading } = useUserStore();
  const hasFetched = useRef(false); // to prevent double fetch

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = await getData('user_token');
        if (!token) return;

        const res = await withErrorHandler(() =>
          axios.get(BASE_URI + 'profile/view', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        )();
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx');
        console.log('user hook called');
        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx');

        if (res?.data?.user) {
          setUser(res.data.user);
        }
        console.log('user res ', res.data.user);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setLoading, setUser]);

  return { user, isLoading };
};

export default useUser;
