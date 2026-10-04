import { MessageCircle, UserRoundPen, UsersRound } from 'lucide-react';

const sections = {
  friends: {
    title: '친구찾기',
    description: '새로운 친구와 나만의 하모니를 찾아보세요.',
    icon: UsersRound,
  },
  messages: {
    title: '메세지',
    description: '친구들과 나누는 대화를 한곳에서 확인하세요.',
    icon: MessageCircle,
  },
  profile: {
    title: '프로필',
    description: '나를 소개하는 프로필을 관리하세요.',
    icon: UserRoundPen,
  },
};

export default function PagePlaceholder({
  section,
}: {
  section: keyof typeof sections;
}) {
  const { title, description, icon: Icon } = sections[section];

  return (
    <section aria-labelledby="page-title" className="space-y-6">
      <div className="space-y-2">
        <h1
          id="page-title"
          className="text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {title}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      <div className="flex min-h-[min(55dvh,32rem)] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card/80 p-6 text-center shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 text-violet-500">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          곧 만나요. {title} 화면을 준비 중이에요.
        </p>
      </div>
    </section>
  );
}
