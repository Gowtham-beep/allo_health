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

type QueueItem = {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  priority: 'regular' | 'urgent';
  status: 'Waiting' | 'With Doctor' | 'Completed';
  createdAt: string;
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
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateQueueStatus(id, status),
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
            <TableHead>Age</TableHead>
            <TableHead>Symptoms</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((patient, index) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.symptoms}</TableCell>
              <TableCell>
                <Badge
                  variant={patient.priority === 'urgent' ? 'destructive' : 'secondary'}
                >
                  {patient.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  value={patient.status}
                  onValueChange={(value) =>
                    updateStatus({ id: patient.id, status: value })
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
                {new Date(patient.createdAt).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}