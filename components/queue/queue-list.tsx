'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateQueueStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  gender: string;
  location: string;
  availability: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type QueueItem = {
  id: number;
  queueNumber: number;
  status: 'Waiting' | 'With Doctor' | 'Completed';
  createdAt: string;
  user: User;
  doctor: Doctor;
};

type QueueListProps = {
  queue: QueueItem[];
};

const statusColors = {
  Waiting: 'bg-yellow-100 text-yellow-800',
  'With Doctor': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

export function QueueList({ queue }: QueueListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateQueueStatus(id.toString(), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      toast({
        title: 'Success',
        description: 'Patient status updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update patient status.',
        variant: 'destructive',
      });
    },
  });

  if (!Array.isArray(queue)) {
    return null;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Queue Number</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.queueNumber}</TableCell>
              <TableCell>{item.user?.name||'Unknown User'}</TableCell>
              <TableCell>{item.doctor?.name||'Unknown doctor'}</TableCell>
              <TableCell>
                <Select
                  value={item.status}
                  onValueChange={(value) =>
                    updateStatus({ id: item.id, status: value })
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusColors).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
