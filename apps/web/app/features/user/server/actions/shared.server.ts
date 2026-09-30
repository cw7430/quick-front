import { ApiError } from '@repo/shared-api/error';
import { ResponseCode } from '@repo/shared-constants/api';

import { createTokenCookie } from '@/shared/lib/server';
import {
  loginAndRefreshResponseSchemaForServer,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schemas';

export const loginAndRefresh = async (
  res: LoginAndRefreshResponseDtoForServer,
) => {
  const validation = loginAndRefreshResponseSchemaForServer.safeParse(res);

  if (!validation.success) {
    console.error('Parse Error: ', validation.error.message);
    throw new ApiError(
      ResponseCode.INTERNAL_SERVER_ERROR.code,
      ResponseCode.INTERNAL_SERVER_ERROR.message,
    );
  }

  const result = validation.data;

  const accessTokenCookie = createTokenCookie({ type: 'access' });

  const refreshTokenCookie = createTokenCookie({
    type: 'refresh',
    isAuto: result.isAuto,
    refreshTokenExpiresAtMs: result.refreshTokenExpiresAtMs,
  });

  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    await accessTokenCookie.serialize(result.accessToken),
  );
  headers.append(
    'Set-Cookie',
    await refreshTokenCookie.serialize(result.refreshToken),
  );

  const {
    refreshToken: _refreshToken,
    refreshTokenExpiresAtMs: _refreshTokenExpiresAtMs,
    isAuto: _isAuto,
    accessToken: _accessToken,
    ...clientData
  } = result;

  return {
    data: clientData,
    headers,
  };
};
