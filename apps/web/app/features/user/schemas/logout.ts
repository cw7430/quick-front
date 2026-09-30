import { z } from 'zod';

export const logoutRequestSchema = z.object({
  refreshToken: z.string().optional(),
});

export type LogoutRequestDto = z.infer<typeof logoutRequestSchema>;
