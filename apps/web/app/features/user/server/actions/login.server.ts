import type {
  NativeLoginRequestDto,
  LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schemas';
import { ServerRequest } from '@/shared/api/server';
import { loginAndRefresh } from './shared.server';

const { apiPost } = ServerRequest;

export const nativeLogin = async (body: NativeLoginRequestDto) => {
  const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
    '/user/login/native',
    {},
    body,
  );

  return loginAndRefresh(res);
};
