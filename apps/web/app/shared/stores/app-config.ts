import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppConfigState {
  isAutoLogin: boolean;
  setAutoLogin: (isAutoLogin: boolean) => void;
}

export const useAppConfigStore = create<AppConfigState>()(
  persist(
    (set) => ({
      isAutoLogin: false,
      setAutoLogin: (isAutoLogin: boolean) => set({ isAutoLogin }),
    }),
    {
      name: 'app-config-storage',
    },
  ),
);
