import { useEffect } from 'react';
import { useNavigate, useSearchParams, useFetcher } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/shallow';
import { Loader2 } from 'lucide-react';

import type { action } from '@/routes/_guest/login';
import { useAppConfigStore } from '@/shared/stores';
import { useAuthStore } from '@/features/user/stores';
import {
  nativeLoginRequestSchema,
  type NativeLoginRequestDto,
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
import { Button } from '@/shared/components/ui/shadcn/button';
import { Checkbox } from '@/shared/components/ui/shadcn/checkbox';

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();

  const { isAutoLogin, setAutoLogin } = useAppConfigStore(
    useShallow((s) => ({
      isAutoLogin: s.isAutoLogin,
      setAutoLogin: s.setAutoLogin,
    })),
  );

  const login = useAuthStore((s) => s.login);

  const redirect = searchParams.get('redirect');

  const redirectTo = redirect && redirect.startsWith('/') ? redirect : '/';

  const loginForm = useForm<NativeLoginRequestDto>({
    mode: 'onChange',
    resolver: zodResolver(nativeLoginRequestSchema),
    defaultValues: { email: '', password: '', isAuto: isAutoLogin },
  });

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    subscribe,
    formState: { errors },
  } = loginForm;

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
        }
      },
    });
  }, [subscribe, errors.root, clearErrors]);

  const onSubmit: SubmitHandler<NativeLoginRequestDto> = (data) => {
    fetcher.submit(
      {
        ...data,
      },
      {
        method: 'post',
        action: '/login',
        encType: 'application/json',
      },
    );
  };

  const isPending = fetcher.state !== 'idle';

  useEffect(() => {
    const res = fetcher.data;

    if (!res) return;

    if (res.success) {
      login(res.data);
      navigate(redirectTo, { replace: true });
      return;
    }

    switch (res.code) {
      case 'LGE':
      case 'VE':
        setError('root', {
          type: 'server',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        });
        break;
      case 'KE':
        setError('root', {
          type: 'server',
          message: 'API KEY가 잘못되었습니다. 관리자에게 문의하세요.',
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
    <Form {...loginForm}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  placeholder="hello@example.com"
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
          name="isAuto"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  id="isAuto"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setAutoLogin(checked as boolean);
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormLabel
                htmlFor="isAuto"
                className="cursor-pointer font-normal"
              >
                Remember Me
              </FormLabel>
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
          {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          로그인
        </Button>
      </form>
    </Form>
  );
}
