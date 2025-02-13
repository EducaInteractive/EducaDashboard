'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PERMISSIONS } from '@/config/permissions';

export function RouteGuard({ children, permission }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user?.role) {
    router.push('/login');
    return null;
  }

  const hasPermission = PERMISSIONS[permission]?.includes(session.user.role);

  if (!hasPermission) {
    router.push('/unauthorized');
    return null;
  }

  return children;
}