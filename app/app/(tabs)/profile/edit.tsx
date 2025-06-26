import Loader from '@/components/Loader';
import { EditProfileScreen } from '@/screens';
import { useUserStore } from '@/store/user.store';
import React from 'react';

const Index: React.FC = () => {
  const { user, isLoading } = useUserStore();

  if (isLoading) return <Loader />;

  return <>{user && <EditProfileScreen user={user} />}</>;
};

export default Index;
