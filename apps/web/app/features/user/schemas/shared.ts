import { z } from 'zod';

export const authStateDataSchema = z.object({
  accessTokenExpiresAtMs: z.number().nullable(),
  authType: z.enum(['NATIVE', 'SOCIAL', 'CROSS']).nullable(),
  nickName: z.string().nullable(),
  gender: z.enum(['M', 'F']).nullable(),
  role: z.enum(['USER', 'ADMIN']).nullable(),
});

export const loginAndRefreshResponseSchemaForClient = authStateDataSchema
  .partial()
  .extend({
    accessTokenExpiresAtMs: z.number(),
    authType: z.enum(['NATIVE', 'SOCIAL', 'CROSS']),
    nickName: z.string(),
    gender: z.enum(['M', 'F']),
    role: z.enum(['USER', 'ADMIN']),
  });

export const loginAndRefreshResponseSchemaForServer =
  loginAndRefreshResponseSchemaForClient.extend({
    accessToken: z.string(),
    refreshToken: z.string(),
    refreshTokenExpiresAtMs: z.number(),
    isAuto: z.boolean(),
  });

export type LoginAndRefreshResponseDtoForClient = z.infer<
  typeof loginAndRefreshResponseSchemaForClient
>;

export type LoginAndRefreshResponseDtoForServer = z.infer<
  typeof loginAndRefreshResponseSchemaForServer
>;

export type AuthStateData = z.infer<typeof authStateDataSchema>;

export type AuthState = AuthStateData & {
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;

  login: (data: LoginAndRefreshResponseDtoForClient) => void;

  logout: () => void;
};
