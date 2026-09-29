import { ResponseCode } from '@repo/shared-constants/api';
import type { ApiFail } from '@repo/shared-schemas/api';
import { ApiError } from '../error/index.js';

export type ContentType = 'JSON' | 'FORM';

export type QueryValue = string | number | boolean | null | undefined;

export const resolveContentType = (contentType?: ContentType) =>
  contentType === 'FORM' ? undefined : 'application/json';

export const resolveQuery = (params?: Record<string, QueryValue>) => {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value != null) {
      searchParams.append(key, String(value));
    }
  }

  const query = searchParams.toString();

  return query ? `?${query}` : '';
};

export const resolveBody = (body?: unknown, contentType?: ContentType) => {
  if (body === undefined || body === null) return undefined;

  if (contentType === 'FORM' || body instanceof FormData) {
    return body as FormData;
  }

  return JSON.stringify(body);
};

export const fetchResponse = async <T>(res: Response): Promise<T> => {
  const isJson = res.headers.get('content-type')?.includes('application/json');

  if (!isJson) {
    if (!res.ok) {
      throw new ApiError(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }
    return null as T;
  }

  const data = await res.json();

  if (!res.ok) {
    const errorData = data as ApiFail;
    throw new ApiError(
      errorData?.code ?? ResponseCode.INTERNAL_SERVER_ERROR.code,
      errorData?.message ?? ResponseCode.INTERNAL_SERVER_ERROR.message,
      errorData?.code === 'VE' ? errorData?.errors : undefined,
    );
  }

  return data as T;
};