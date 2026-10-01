import { data } from 'react-router';
import { ApiError } from '@repo/shared-api/error';
import { ResponseCode } from '@repo/shared-constants/api';

import type { Route } from './+types/register';
import { registerRequestSchema } from '@/features/user/schemas';
import { register } from '@/features/user/server/actions';

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const parsed = registerRequestSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    nickName: formData.get('nickName'),
    gender: formData.get('gender'),
  });

  if (!parsed.success) {
    console.error('Parse Error: ', parsed.error.message);
    return data({
      success: false as const,
      code: ResponseCode.VALIDATION_ERROR,
    });
  }

  try {
    const { data: loginData, headers } = await register(parsed.data);

    return data(
      {
        success: true as const,
        data: loginData,
      },
      {
        headers,
      },
    );
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
