import { createCookie } from 'react-router';

export const createTokenCookie = (
  options:
    | { type: 'access' }
    | { type: 'refresh'; isAuto: false }
    | { type: 'refresh'; isAuto: boolean; refreshTokenExpiresAtMs: number },
) => {
  if (options.type === 'access') {
    return createCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  const refreshMaxAge = options.isAuto
    ? Math.max(
        0,
        Math.floor((options.refreshTokenExpiresAtMs - Date.now()) / 1000),
      )
    : undefined;

  return createCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    ...(refreshMaxAge !== undefined && { maxAge: refreshMaxAge }),
  });
};

export const getTokenCookies = async (request: Request) => {
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) {
    return undefined;
  }

  const accessTokenCookie = createTokenCookie({
    type: 'access',
  });

  const refreshTokenCookie = createTokenCookie({
    type: 'refresh',
    isAuto: false,
  });

  const [accessToken, refreshToken] = await Promise.all([
    accessTokenCookie.parse(cookieHeader),
    refreshTokenCookie.parse(cookieHeader),
  ]);

  return {
    accessToken: accessToken as string | undefined,
    refreshToken: refreshToken as string | undefined,
  };
};
