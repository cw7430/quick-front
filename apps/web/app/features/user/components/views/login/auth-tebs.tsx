import { useState } from 'react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components/ui/shadcn/tabs';
import { LoginForm, RegisterForm } from './form';

export default function AuthTebs() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as 'login' | 'register')}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50">
        <TabsTrigger value="login">로그인</TabsTrigger>
        <TabsTrigger value="register">회원가입</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}
