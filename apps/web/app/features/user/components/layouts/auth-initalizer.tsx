import { useCallback, useEffect, useRef } from 'react';
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useFetcher,
} from 'react-router';
import { useShallow } from 'zustand/shallow';
import { toast } from 'sonner';
import { ResponseCode } from '@repo/shared-constants/api';

import type { action } from '@/routes/_api/refresh';
import { useAppConfigStore } from '@/shared/stores';
import { useAuthStore, validateAuthIntegrity } from '@/features/user/stores';

interface Props {
  hasAccessToken: boolean;
}

export default function AuthInitalizer({ hasAccessToken }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;
  const fetcher = useFetcher<typeof action>();

  const isAutoLogin = useAppConfigStore((s) => s.isAutoLogin);
  const { isLoggedIn, logout, login, hasHydrated } = useAuthStore(
    useShallow((s) => ({
      isLoggedIn: validateAuthIntegrity(s),
      logout: s.logout,
      login: s.login,
      hasHydrated: s.hasHydrated,
    })),
  );

  const handleRefresh = useCallback(() => {
    fetcher.submit(
      { isAuto: String(isAutoLogin) },
      { method: 'post', action: '/refresh' },
    );
  }, [fetcher, isAutoLogin]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(
    (alertText: string) => {
      logout();
      clearRefreshTimer();
      toast(alertText);
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
    },
    [logout, clearRefreshTimer, navigate, currentPath],
  );

  const handleAuthFailure = useCallback(() => {
    handleLogout('세션이 만료되었습니다.');
  }, [handleLogout]);

  const handleServerError = useCallback(() => {
    handleLogout('서버 문제가 발생하였습니다.');
  }, [handleLogout]);

  const scheduleRefresh = useCallback(
    (expiresAt: number) => {
      clearRefreshTimer();

      const now = Date.now();
      const timeUntilRefresh = Math.max(0, expiresAt - now - 2 * 60 * 1000);

      timerRef.current = setTimeout(() => {
        handleRefresh();
      }, timeUntilRefresh);
    },
    [handleRefresh, clearRefreshTimer],
  );

  const recoverAuth = useCallback(() => {
    const { accessTokenExpiresAtMs } = useAuthStore.getState();

    if (hasAccessToken && accessTokenExpiresAtMs && isLoggedIn) {
      scheduleRefresh(accessTokenExpiresAtMs);
      return;
    }

    handleRefresh();
  }, [scheduleRefresh, isLoggedIn, hasAccessToken, handleRefresh]);

  useEffect(() => {
    const res = fetcher.data;

    if (!res) return;

    if (res.success) {
      login(res.data);
      scheduleRefresh(res.data.accessTokenExpiresAtMs);
    } else {
      switch (res.code) {
        case ResponseCode.UNAUTHORIZED.code:
        case ResponseCode.INVALID_TOKEN.code:
        case ResponseCode.EXPIRED_TOKEN.code:
          handleAuthFailure();
          break;
        default:
          handleServerError();
      }
    }
  }, [
    fetcher.data,
    login,
    navigate,
    handleAuthFailure,
    handleServerError,
    scheduleRefresh,
  ]);

  useEffect(() => {
    if (!hasHydrated || !isLoggedIn) return;

    recoverAuth();

    return () => clearRefreshTimer();
  }, [hasHydrated, recoverAuth, clearRefreshTimer, isLoggedIn]);

  return null;
}
