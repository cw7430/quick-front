import { Sparkles } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/shadcn/card';

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-900 via-background to-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] translate-y-1/2 pointer-events-none" />

      <Card className="w-full max-w-md glass-card border-white/10 relative z-10">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-900/50 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-display font-bold bg-clip-text text-transparent bg-linear-to-br from-white to-white/60">
              Quick
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Find your perfect harmony.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>{/* Contents */}</CardContent>
      </Card>
    </div>
  );
}
