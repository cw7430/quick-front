import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  AuthState,
  AuthStateData,
  LoginAndRefreshResponseDtoForClient,
} from '@/features/user/schemas';

const initialState = {
  accessTokenExpiresAtMs: null,
  authType: null,
  nickName: null,
  gender: null,
  role: null,
};

export const validateAuthIntegrity = (state: AuthStateData) => {
  const { accessTokenExpiresAtMs, authType, nickName, gender, role } = state;

  const isAccessTokenValid =
    accessTokenExpiresAtMs != null &&
    Date.now() + 30 * 1000 < accessTokenExpiresAtMs;

  return !!(authType && nickName && gender && role && isAccessTokenValid);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      hasHydrated: false,

      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),

      login: (data: LoginAndRefreshResponseDtoForClient) => set({ ...data }),

      logout: () => set(initialState),
    }),
    {
      name: 'auth-storage',

      partialize: (state) => ({ ...state }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
