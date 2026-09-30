import { ApiError } from '@repo/shared-api/error';
import { ResponseCode } from '@repo/shared-constants/api';

import type {
  CheckEmailRequestDto,
  RegisterRequestDto,
  LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schemas';
import { ServerRequest } from '@/shared/api/server';
import { loginAndRefresh } from './shared.server';

const { apiPost } = ServerRequest;

export const checkEmail = async (body: CheckEmailRequestDto) => {
  await apiPost('/email', {}, body);
};

export const register = async (body: RegisterRequestDto) => {
  if (body.password !== body.confirmPassword) {
    throw new ApiError(
      ResponseCode.CONFLICT.code,
      ResponseCode.CONFLICT.message,
    );
  }

  const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
    '/user/register',
    {},
    body,
  );

  return loginAndRefresh(res);
};
