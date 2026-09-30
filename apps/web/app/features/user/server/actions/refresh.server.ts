import type {
  RefreshRequestDto,
  LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schemas';
import { ServerRequest } from '@/shared/api/server';
import { loginAndRefresh } from './shared.server';

const { apiPost } = ServerRequest;

export const refresh = async (body: RefreshRequestDto) => {
  const res = await apiPost<LoginAndRefreshResponseDtoForServer>(
    '/user/refresh',
    { authType: 'refresh' },
    body,
  );

  return loginAndRefresh(res);
};
