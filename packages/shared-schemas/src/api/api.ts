import { z } from 'zod';
import { ResponseCodeValues } from '@repo/shared-constants/api';

const baseApiFailSchema = z.object({
  code: z.enum(ResponseCodeValues).exclude(['VE']),
  message: z.string(),
});

const validationFieldsSchema = z.object({
  field: z.string(),
  message: z.string(),
});

const validationErrorSchema = baseApiFailSchema.extend({
  code: z.literal('VE'),
  message: z.string(),
  errors: z.array(validationFieldsSchema).optional(),
});

const apiFailSchema = z.discriminatedUnion('code', [
  baseApiFailSchema,
  validationErrorSchema,
]);

const baseActionSchema = z.object({
  success: z.boolean(),
});

export const successActionSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  baseActionSchema.extend({
    success: z.literal(true),
    data: resultSchema,
  });

export const errorActionSchema = baseActionSchema.extend({
  success: z.literal(false),
  error: apiFailSchema,
});

export type ApiFail = z.infer<typeof apiFailSchema>;

export type ValidationFields = z.infer<typeof validationFieldsSchema>;

export type SuccessAction<T> = z.infer<
  ReturnType<typeof successActionSchema<z.ZodType<T>>>
>;

export type ErrorAction = z.infer<typeof errorActionSchema>;
