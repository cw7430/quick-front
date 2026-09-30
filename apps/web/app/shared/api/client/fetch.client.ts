import {
  resolveContentType,
  resolveQuery,
  resolveBody,
  fetchResponse,
  type ContentType,
} from '@repo/shared-api/fetch';

interface FetchOptions extends RequestInit {
  contentType?: ContentType;
  baseUrl?: string;
}

const resolveUrl = (input: string, baseUrl?: string) => {
  if (!baseUrl) {
    return input;
  }
  const separator = baseUrl.endsWith('/') || input.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${input}`;
};

const clientFetch = async <T>(
  input: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { contentType = 'JSON', baseUrl, ...init } = options;

  const contentOptions = resolveContentType(contentType);
  const urlOptions = resolveUrl(input, baseUrl);

  const res = await fetch(urlOptions, {
    ...init,
    credentials: 'include',
    headers: {
      ...(contentOptions && { 'Content-Type': contentOptions }),
      ...init?.headers,
    },
  });

  return fetchResponse(res);
};

export const ClientRequest = {
  apiGet: async <T>(
    input: string,
    options?: Omit<FetchOptions, 'contentType'>,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> => {
    const query = resolveQuery(params);

    return clientFetch<T>(`${input}${query}`, {
      method: 'GET',
      ...options,
    });
  },

  apiPost: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return clientFetch<T>(input, {
      method: 'POST',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiPut: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return clientFetch<T>(input, {
      method: 'PUT',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiPatch: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return clientFetch<T>(input, {
      method: 'PATCH',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiDelete: async <T = void>(
    input: string,
    options?: Omit<FetchOptions, 'contentType'>,
  ): Promise<T> => {
    return clientFetch<T>(input, {
      method: 'DELETE',
      ...options,
    });
  },
};
