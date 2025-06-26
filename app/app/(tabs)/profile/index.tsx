import ProfileScreen from '@/screens/ProfileScreen';
import { useUserStore } from '@/store/user.store';
import React from 'react';

const Index = () => {
  const { user } = useUserStore();

  return <>{user && <ProfileScreen profile={user} />}</>;
};

export default Index;
