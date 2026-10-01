import { data } from 'react-router';

import type { Route } from './+types/logout';
import { logout } from '@/features/user/server/actions';

export const action = async ({ request }: Route.ActionArgs) => {
  const { headers } = await logout(request);

  return data(
    {
      success: true as const,
    },
    { headers },
  );
};
