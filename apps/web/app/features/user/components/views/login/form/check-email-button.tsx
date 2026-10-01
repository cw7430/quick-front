import { useEffect, type SetStateAction } from 'react';
import { useFetcher } from 'react-router';
import { useFormContext, useWatch } from 'react-hook-form';
import { ResponseCode } from '@repo/shared-constants/api';

import type { action } from '@/routes/_api/check-email';
import type { RegisterRequestDto } from '@/features/user/schemas';
import { Button } from '@/shared/components/ui/shadcn/button';

interface Props {
  isEmailChecked: boolean;
  setEmailChecked: React.Dispatch<SetStateAction<boolean>>;
  isPending: boolean;
}

export default function CheckEmailButton({
  isEmailChecked,
  setEmailChecked,
  isPending,
}: Props) {
  const fetcher = useFetcher<typeof action>();

  const { control, setError, clearErrors, trigger } =
    useFormContext<RegisterRequestDto>();

  const email = useWatch({
    control,
    name: 'email',
  });

  const onClick = async () => {
    clearErrors('email');
    const isValid = await trigger('email');

    if (!email || !isValid) {
      setEmailChecked(false);
      return;
    }

    fetcher.submit(
      { email },
      {
        method: 'post',
        action: '/check-email',
      },
    );
  };

  useEffect(() => {
    const res = fetcher.data;

    if (!res) return;

    if (res.success) {
      setEmailChecked(true);
      return;
    }

    switch (res.code) {
      case ResponseCode.VALIDATION_ERROR.code:
        setError('email', {
          message: '이메일 양식이 올바르지 않습니다.',
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
  }, [fetcher.data, setEmailChecked, setError]);

  return (
    <Button
      type="button"
      variant="outline"
      className="shrink-0 px-4 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
      onClick={onClick}
      disabled={isEmailChecked || isPending}
    >
      중복체크
    </Button>
  );
}
