import { useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useFetcher,
} from 'react-router';
import { LogOut } from 'lucide-react';

import type { action } from '@/routes/_api/logout';
import { useAuthStore } from '@/features/user/stores';
import { Button } from '@/shared/components/ui/shadcn/button';

export default function LogoutButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;
  const fetcher = useFetcher<typeof action>();

  const logout = useAuthStore((s) => s.logout);

  const onClick = () => {
    fetcher.submit({}, { method: 'post', action: '/logout' });
  };

  useEffect(() => {
    const res = fetcher.data;

    if (!res) return;

    logout();
    navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, {
      replace: true,
    });
  }, [fetcher.data, logout, navigate, currentPath]);

  const isPending = fetcher.state !== 'idle';

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive transition-colors"
      onClick={onClick}
      disabled={isPending}
      aria-label="로그아웃"
    >
      <LogOut className="w-5 h-5" />
    </Button>
  );
}
