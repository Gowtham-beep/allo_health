'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  Stethoscope,
  Calendar,
  ClipboardList,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  const cards = [
    {
      title: 'Queue Management',
      description: 'Manage patient queue and walk-ins',
      icon: ClipboardList,
      path: '/queue',
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: Calendar,
      path: '/appointments',
    },
    {
      title: 'Users',
      description: 'Manage staff and patient accounts',
      icon: Users,
      path: '/users',
    },
    {
      title: 'Doctors',
      description: 'Manage doctor profiles and schedules',
      icon: Stethoscope,
      path: '/doctors',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Hospital Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.path}
              className="p-6 hover:bg-muted/50 cursor-pointer"
              onClick={() => router.push(card.path)}
            >
              <div className="space-y-2">
                <Icon className="h-6 w-6" />
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}