import { Outlet, redirect } from 'react-router';

import type { Route } from './+types/layout';
import { getTokenCookies } from '@/shared/lib/server';
import { AuthInitalizer } from '@/features/user/components/layouts';
import { Header } from '@/shared/components/layouts';

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
    <div className="relative isolate min-h-dvh bg-background">
      <AuthInitalizer hasAccessToken={hasAccessToken} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-violet-500/5 to-transparent"
      />
      <Header />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-foreground"
      >
        본문으로 바로가기
      </a>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl px-4 py-8 outline-none sm:px-6 sm:py-10 lg:px-8"
      >
        <Outlet />
      </main>
    </div>
  );
}
