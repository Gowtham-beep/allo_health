'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  LogOut,
  Home,
  UserPlus,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/queue', label: 'Queue', icon: ClipboardList },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="text-xl font-bold">allo Health</div>
          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={pathname === item.path ? 'default' : 'ghost'}
                  className="gap-2"
                  onClick={() => router.push(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            <Button variant="ghost" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}