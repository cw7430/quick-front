import { z } from 'zod';

export const refreshRequestSchema = z.object({
  isAuto: z.boolean(),
});

export type RefreshRequestDto = z.infer<typeof refreshRequestSchema>;
