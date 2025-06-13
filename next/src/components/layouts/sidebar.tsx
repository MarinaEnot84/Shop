'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../app/index';


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
  
  interface UserResponse {
	user: User;
  }

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const activeTab = pathname?.includes('algorithms') ? 'algorithms' : 'products';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<UserResponse>('/me');
        const userData = response.data.user;

        const roles: Role[] = Array.isArray(userData.roles)
          ? userData.roles.map(role => {

              if (typeof role === 'number') {
                return {
                  id: role,
                  name: role === 1 ? 'Админ' : 'Пользователь',
                  pages: role === 1 
                    ? ['/products', '/algorithms', '/'] 
                    : ['/products', '/']
                };
              }
              return role;
            })
          : [];

        setUser({ ...userData, roles });
      } catch (err) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className='h-screen w-56 bg-slate-100 flex flex-col'>
        <div className='p-5'>Загрузка...</div>
      </div>
    );
  }

  const hasAlgorithmsAccess = user?.roles?.some(role => 
    role.pages?.includes('/algorithms')
  );

  return (
    <div className='h-screen w-56 bg-slate-100 flex flex-col'>
      <div className='h1-text flex items-center gap-1 justify-center py-3 text-slate-100 mb-6 bg-gray-800 rounded-br-2xl'>
        Test
        <svg
          width='34'
          height='31'
          viewBox='0 0 34 31'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M6.35098 0.178467C5.56954 0.178467 4.8201 0.488893 4.26754 1.04146L2.22598 3.08302C-0.075326 5.38432 -0.075326 9.11547 2.22598 11.4168C4.32722 13.518 7.62052 13.7007 9.92902 11.9648C10.9134 12.7037 12.138 13.1428 13.4643 13.1428C14.7908 13.1428 16.0156 12.7036 17 11.9644C17.9844 12.7036 19.2092 13.1428 20.5357 13.1428C21.862 13.1428 23.0866 12.7037 24.071 11.9648C26.3795 13.7007 29.6728 13.518 31.774 11.4168C34.0753 9.11547 34.0753 5.38432 31.774 3.08302L29.7325 1.04146C29.1799 0.4889 28.4305 0.178474 27.649 0.178474L6.35098 0.178467Z'
            fill='#E2E8F0'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M2.85714 28.4642V14.7065C5.0889 15.7648 7.69698 15.764 9.92926 14.7053C11.0013 15.2143 12.201 15.4999 13.4643 15.4999C14.7278 15.4999 15.9278 15.2142 17 14.705C18.0722 15.2142 19.2722 15.4999 20.5357 15.4999C21.799 15.4999 22.9987 15.2143 24.0707 14.7053C26.303 15.764 28.9111 15.7648 31.1429 14.7065V28.4642H32.3214C32.9723 28.4642 33.5 28.9919 33.5 29.6428C33.5 30.2937 32.9723 30.8213 32.3214 30.8213H1.67857C1.02766 30.8213 0.5 30.2937 0.5 29.6428C0.5 28.9919 1.02766 28.4642 1.67857 28.4642H2.85714ZM7.57143 19.0356C7.57143 18.3847 8.09909 17.857 8.75 17.857H13.4643C14.1152 17.857 14.6429 18.3847 14.6429 19.0356V23.7499C14.6429 24.4008 14.1152 24.9285 13.4643 24.9285H8.75C8.09909 24.9285 7.57143 24.4008 7.57143 23.7499V19.0356ZM20.5357 17.857C19.8848 17.857 19.3571 18.3847 19.3571 19.0356V27.2856C19.3571 27.9365 19.8848 28.4642 20.5357 28.4642H25.25C25.9009 28.4642 26.4286 27.9365 26.4286 27.2856V19.0356C26.4286 18.3847 25.9009 17.857 25.25 17.857H20.5357Z'
            fill='#E2E8F0'
          />
        </svg>
      </div>
      <ul className='p-[10px] flex flex-col gap-4'>
        <li>
          <Link
            href='/products'
            className={`pr-1 relative flex justify-between items-center font-medium text-xl transition group ${
              pathname.startsWith('/products')
                ? 'text-blue-600'
                : 'text-slate-800 hover:text-blue-500'
            }`}>
            <h3>Товары</h3>
            <svg
              className={`transition-transform duration-300 group-hover:translate-x-1.5 ${
                pathname.startsWith('/products') ? 'block' : 'hidden'
              }`}
              width='20'
              height='18'
              viewBox='0 0 20 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11.2197 0.96967C11.5126 0.676777 11.9874 0.676777 12.2803 0.96967L19.7803 8.46967C19.921 8.61032 20 8.80109 20 9C20 9.19891 19.921 9.38968 19.7803 9.53033L12.2803 17.0303C11.9874 17.3232 11.5126 17.3232 11.2197 17.0303C10.9268 16.7374 10.9268 16.2626 11.2197 15.9697L17.4393 9.75H1.25C0.835786 9.75 0.5 9.41421 0.5 9C0.5 8.58579 0.835786 8.25 1.25 8.25H17.4393L11.2197 2.03033C10.9268 1.73744 10.9268 1.26256 11.2197 0.96967Z'
                fill='currentColor'
              />
            </svg>
          </Link>
        </li>
        {hasAlgorithmsAccess && (
        <li>
          <Link
            href='/algorithms'
            className={`pr-1 relative flex justify-between items-center font-medium text-xl transition group ${
              pathname.startsWith('/algorithms')
                ? 'text-blue-600'
                : 'text-slate-800 hover:text-blue-500'
            }`}>
            <h3>Алгоритмы</h3>
            <svg
              className={`transition-transform duration-300 group-hover:translate-x-1.5 ${
                pathname.startsWith('/algorithms') ? 'block' : 'hidden'
              }`}
              width='20'
              height='18'
              viewBox='0 0 20 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11.2197 0.96967C11.5126 0.676777 11.9874 0.676777 12.2803 0.96967L19.7803 8.46967C19.921 8.61032 20 8.80109 20 9C20 9.19891 19.921 9.38968 19.7803 9.53033L12.2803 17.0303C11.9874 17.3232 11.5126 17.3232 11.2197 17.0303C10.9268 16.7374 10.9268 16.2626 11.2197 15.9697L17.4393 9.75H1.25C0.835786 9.75 0.5 9.41421 0.5 9C0.5 8.58579 0.835786 8.25 1.25 8.25H17.4393L11.2197 2.03033C10.9268 1.73744 10.9268 1.26256 11.2197 0.96967Z'
                fill='currentColor'
              />
            </svg>
          </Link>
        </li>
      )}
      </ul>
      <div className='mt-auto p-5 text-slate-900'>
        <div className='flex flex-wrap gap-2 mb-4'>
          {user?.roles?.map((role) => (
            <span
              key={role.id}
              className='bg-gray-300 px-2 py-1 rounded text-sm'>
              {role.name}
            </span>
          ))}
        </div>
        <div className='w-full flex justify-between items-center'>
          <h6>{user?.name || 'Пользователь'}</h6>
          <button
            onClick={handleLogout}
            className='text-slate-700 hover:text-slate-900 transition-colors'
            title='Выйти'>
            <svg
              width='18'
              height='20'
              viewBox='0 0 18 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M3 2C2.17157 2 1.5 2.67157 1.5 3.5L1.5 17C1.5 17.8284 2.17157 18.5 3 18.5H9C9.82843 18.5 10.5 17.8284 10.5 17V13.25C10.5 12.8358 10.8358 12.5 11.25 12.5C11.6642 12.5 12 12.8358 12 13.25V17C12 18.6569 10.6569 20 9 20H3C1.34315 20 -8.9407e-08 18.6569 0 17L5.81145e-07 3.5C6.70552e-07 1.84315 1.34315 0.5 3 0.5L9 0.5C10.6569 0.5 12 1.84315 12 3.5V7.25C12 7.66421 11.6642 8 11.25 8C10.8358 8 10.5 7.66421 10.5 7.25V3.5C10.5 2.67157 9.82843 2 9 2L3 2ZM13.7197 6.71967C14.0126 6.42678 14.4874 6.42678 14.7803 6.71967L17.7803 9.71967C18.0732 10.0126 18.0732 10.4874 17.7803 10.7803L14.7803 13.7803C14.4874 14.0732 14.0126 14.0732 13.7197 13.7803C13.4268 13.4874 13.4268 13.0126 13.7197 12.7197L15.4393 11L4.5 11C4.08579 11 3.75 10.6642 3.75 10.25C3.75 9.83579 4.08579 9.5 4.5 9.5L15.4393 9.5L13.7197 7.78033C13.4268 7.48744 13.4268 7.01256 13.7197 6.71967Z'
                fill='currentColor'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;