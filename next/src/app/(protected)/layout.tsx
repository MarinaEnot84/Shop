'use client';
import Sidebar from '@/components/layouts/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();
    useEffect(() => {
        
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/'); 
        }
      }, [router]);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-slate-100">
        {children}
      </div>
    </div>
  );
}