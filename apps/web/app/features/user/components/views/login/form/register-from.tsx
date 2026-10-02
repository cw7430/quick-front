import { useState, useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  useFetcher,
  useFetchers,
} from 'react-router';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { ResponseCode } from '@repo/shared-constants/api';

import type { action } from '@/routes/_api/register';
import { useAuthStore } from '@/features/user/stores';
import {
  registerRequestSchema,
  type RegisterRequestDto,
} from '@/features/user/schemas';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/shadcn/form';
import { Input } from '@/shared/components/ui/shadcn/input';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/shadcn/tabs';
import { Button } from '@/shared/components/ui/shadcn/button';
import CheckEmailButton from './check-email-button';

export default function RegisterFrom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const fetchers = useFetchers();

  const isPending = fetchers.some(
    (f) => f.formAction === '/register' || f.formAction === '/check-email',
  );
  const isRegisterPending = fetcher.state !== 'idle';

  const login = useAuthStore((s) => s.login);

  const redirect = searchParams.get('redirect');

  const redirectTo = redirect && redirect.startsWith('/') ? redirect : '/';

  const [isEmailChecked, setEmailChecked] = useState<boolean>(false);

  const registerForm = useForm<RegisterRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickName: '',
      gender: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    subscribe,
    formState: { errors },
  } = registerForm;

  const email = useWatch({ control, name: 'email' });
  const password = useWatch({ control, name: 'password' });
  const confirmPassword = useWatch({ control, name: 'confirmPassword' });

  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword;
  const isPasswordNotMatch =
    password && confirmPassword && password !== confirmPassword;

  useEffect(() => {
    return subscribe({
      formState: {
        values: true,
      },
      callback: () => {
        if (errors.root) {
          clearErrors('root');
          clearErrors('email');
          clearErrors('password');
          clearErrors('confirmPassword');
          clearErrors('nickName');
          clearErrors('gender');
        }
      },
    });
  }, [subscribe, errors.root, clearErrors]);

  const onSubmit: SubmitHandler<RegisterRequestDto> = (data) => {
    if (!isEmailChecked) {
      setError('email', {
        message: '이메일 중복체크를 해주세요',
      });
      return;
    }
    fetcher.submit(
      {
        ...data,
      },
      {
        method: 'post',
        action: '/register',
      },
    );
  };

  useEffect(() => {
    const res = fetcher.data;

    if (!res) return;

    if (res.success) {
      login(res.data);
      navigate(redirectTo, { replace: true });
      return;
    }

    switch (res.code) {
      case ResponseCode.VALIDATION_ERROR.code:
        setError('root', {
          type: 'server',
          message: '입력이 잘못되었습니다.',
        });
        break;
      case ResponseCode.KEY_ERROR.code:
        setError('root', {
          type: 'server',
          message: 'API KEY가 잘못되었습니다. 관리자에게 문의하세요.',
        });
        break;
      case ResponseCode.DUPLICATE_RESOURCE.code:
        setError('email', {
          type: 'server',
          message: '이메일이 중복됩니다.',
        });
        break;
      default:
        setError('root', {
          type: 'server',
          message: '서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
    }
  }, [fetcher.data, login, navigate, redirectTo, setError]);

  return (
    <Form {...registerForm}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="hello@example.com"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmailChecked(false);
                    }}
                    className="bg-secondary/50 border-white/5"
                    disabled={isPending}
                  />
                  <CheckEmailButton
                    isEmailChecked={isEmailChecked}
                    setEmailChecked={setEmailChecked}
                    isPending={isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
              {!errors.email && isEmailChecked && (
                <p className="text-sm text-emerald-500">
                  사용 가능한 이메일입니다.
                </p>
              )}
              {email && !errors.email && !isEmailChecked && (
                <p className="text-sm text-destructive">
                  이메일 중복체크를 해주세요.
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  className="bg-secondary/50 border-white/5"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  className="bg-secondary/50 border-white/5"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
              {!errors.confirmPassword && isPasswordMatch && (
                <p className="text-sm text-emerald-500">
                  비밀번호가 일치합니다.
                </p>
              )}
              {!errors.confirmPassword && isPasswordNotMatch && (
                <p className="text-sm text-destructive">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="nickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>닉네임</FormLabel>
              <FormControl>
                <Input
                  placeholder="홍길동"
                  {...field}
                  className="bg-secondary/50 border-white/5"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성별</FormLabel>
              <Tabs
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                  <TabsTrigger value="M" disabled={isPending}>
                    남성
                  </TabsTrigger>
                  <TabsTrigger value="F" disabled={isPending}>
                    여성
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <FormMessage />
            </FormItem>
          )}
        />
        {errors.root && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive animate-in fade-in zoom-in duration-200">
            <span className="font-medium">{errors.root.message}</span>
          </div>
        )}
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 mt-2"
          disabled={isPending}
        >
          {isRegisterPending && (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          )}
          회원가입
        </Button>
      </form>
    </Form>
  );
}
