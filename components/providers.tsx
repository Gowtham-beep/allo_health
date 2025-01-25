'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication on initial load and route changes
    const token = localStorage.getItem('token');
    const isLoginPage = pathname === '/login';

    if (token && !isLoginPage) {//!token
      router.push('/login');
    } else if (token && isLoginPage) {
      router.push('/dashboard');
    }
  }, [pathname, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}