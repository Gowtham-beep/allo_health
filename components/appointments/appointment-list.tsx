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
import { Button } from '@/components/ui/button';
import { updateAppointment } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
};

type AppointmentListProps = {
  appointments: Appointment[];
};

export function AppointmentList({ appointments }: AppointmentListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAppointment(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment status updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update appointment status.',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      booked: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (!Array.isArray(appointments)) {
    return null;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.doctorName}</TableCell>
              <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="space-x-2">
                {appointment.status === 'booked' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatus({
                          id: appointment.id,
                          status: 'completed',
                        })
                      }
                    >
                      Complete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatus({
                          id: appointment.id,
                          status: 'cancelled',
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}