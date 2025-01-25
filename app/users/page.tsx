'use client';

import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserList } from '@/components/users/user-list';
import { AddUserDialog } from '@/components/users/add-user-dialog';
import { getUsers } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="rounded-lg border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}

function Users() {
  const [open, setOpen] = useState(false);
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserList users={users} />
      <AddUserDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Users />
    </Suspense>
  );
}