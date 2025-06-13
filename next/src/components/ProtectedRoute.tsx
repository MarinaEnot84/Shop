'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/app/index';


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[];
}

interface Role {
	id: number;
	name: string;
	pages: string[];
  }
  
  interface User {
	id: number;
	name: string;
	email: string;
	password?: string;
	roles: Role[]; 
  }

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const response = await api.get<{ user: User }>('/me');
        const user = response.data.user;

         const userRoles = user.roles.map(role => 
          typeof role === 'number' ? role : role.id
        );

        const hasAccess = userRoles.some(roleId => 
          allowedRoles.includes(roleId)
        );

        setIsAllowed(hasAccess);
        if (!hasAccess) {
          router.push('/forbidden');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/');
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isAllowed === null) {
    return <div>Loading...</div>; 
  }

  return <>{isAllowed ? children : null}</>;
};

export default ProtectedRoute;