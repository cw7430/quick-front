import type { LogoutRequestDto } from '@/features/user/schemas';
import { ServerRequest } from '@/shared/api/server';
import { getTokenCookies, createTokenCookie } from '@/shared/lib/server';

const { apiPost } = ServerRequest;

export const logout = async (request: Request) => {
  const cookies = await getTokenCookies(request);

  const refreshToken = cookies?.refreshToken;

  if (refreshToken) {
    try {
      const body: LogoutRequestDto = { refreshToken };
      await apiPost<void>('/user/logout', {}, body);
    } catch (e) {
      console.error('Logout API Error (Ignored):', e);
    }
  }

  const accessTokenCookie = createTokenCookie({ type: 'access' });
  const refreshTokenCookie = createTokenCookie({
    type: 'refresh',
    isAuto: false,
  });

  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    await accessTokenCookie.serialize('', {
      maxAge: 0,
      expires: new Date(0),
    }),
  );
  headers.append(
    'Set-Cookie',
    await refreshTokenCookie.serialize('', {
      maxAge: 0,
      expires: new Date(0),
    }),
  );

  return { headers };
};
