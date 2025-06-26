import { IUser } from '@/interfaces/user.interface';
import { create } from 'zustand';


interface IUserState {
  user: IUser | null;
  isLoading: boolean;

  setUser: (user: IUser|null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<IUserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearUser: () => set({ user: null }),
}));
