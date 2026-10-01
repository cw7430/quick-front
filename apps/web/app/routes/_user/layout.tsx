import { Outlet, redirect } from 'react-router';

import type { Route } from './+types/layout';
import { getTokenCookies } from '@/shared/lib/server';
import { AuthInitalizer } from '@/features/user/components/layouts';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const cookies = await getTokenCookies(request);

  const hasRefreshToken = !!cookies?.refreshToken;
  const hasAccessToken = !!cookies?.accessToken;

  if (!hasRefreshToken) {
    throw redirect('/login');
  }

  return {
    hasAccessToken,
  };
};

export default function UserLayout({ loaderData }: Route.ComponentProps) {
  const { hasAccessToken } = loaderData;

  return (
    <>
      <AuthInitalizer hasAccessToken={hasAccessToken} />
      <Outlet />
    </>
  );
}
