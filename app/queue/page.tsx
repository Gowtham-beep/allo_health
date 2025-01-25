'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QueueList } from '@/components/queue/queue-list';
import { AddPatientDialog } from '@/components/queue/add-patient-dialog';
import { getQueue } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function QueuePage() {
  const [open, setOpen] = useState(false);
  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
  });

  if (isLoading) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Patient Queue</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>
      <QueueList queue={queue} />
      <AddPatientDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}