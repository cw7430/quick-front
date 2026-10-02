import { data } from 'react-router';
import { ApiError } from '@repo/shared-api/error';
import { ResponseCode } from '@repo/shared-constants/api';

import type { Route } from './+types/check-email';
import { checkEmailRequestSchema } from '@/features/user/schemas';
import { checkEmail } from '@/features/user/server/actions';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const parsed = checkEmailRequestSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    console.error('Parse Error: ', parsed.error.message);
    return data({
      success: false as const,
      code: ResponseCode.VALIDATION_ERROR,
    });
  }

  try {
    await checkEmail(parsed.data);
    return data({
      success: true as const,
    });
  } catch (e) {
    if (e instanceof ApiError) {
      return data({
        success: false as const,
        code: e.code,
      });
    }

    throw e;
  }
};
