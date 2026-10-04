import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('routes/_guest/layout.tsx', [
    route('login', 'routes/_guest/login.tsx'),
  ]),
  layout('routes/_user/layout.tsx', [
    index('routes/_user/home.tsx'),
    route('messages', 'routes/_user/messages.tsx'),
    route('profile', 'routes/_user/profile.tsx'),
  ]),
  route('logout', 'routes/_api/logout.ts'),
  route('refresh', 'routes/_api/refresh.ts'),
  route('register', 'routes/_api/register.ts'),
  route('check-email', 'routes/_api/check-email.ts'),
] satisfies RouteConfig;
