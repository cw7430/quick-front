import { z } from 'zod';

export const checkEmailRequestSchema = z.object({
  email: z
    .string()
    .min(1, '이메일 입력해주세요.')
    .pipe(z.email('이메일 형식이 올바르지 않습니다.')),
});

export const registerRequestSchema = checkEmailRequestSchema
  .extend({
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|:;"'<>,.?/~`]).{10,25}$/,
        '비밀번호는 영문, 숫자, 특수문자를 포함하여 10~25자여야 합니다.',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    nickName: z.string().min(1, '닉네임을 입력해주세요.'),
    gender: z.enum(['M', 'F'], '성별을 선택하여주세요'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmPassword'],
      });
    }
  });

export type CheckEmailRequestDto = z.infer<typeof checkEmailRequestSchema>;
export type RegisterRequestDto = z.infer<typeof registerRequestSchema>;
