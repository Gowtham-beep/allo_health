import React from 'react';
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
import { updateAppointment, deleteAppointment as deleteAppointmentApi } from '@/lib/api'; // Renamed import
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Check, X } from 'lucide-react';

type Appointment = {
  id: string;
  appointmentDate: string;
  status: 'booked' | 'completed' | 'cancelled' | 'Urgent';
  patientName: string;
  doctor: {
    id: number;
    name: string;
    specialization: string;
  };
};

type AppointmentListProps = {
  appointments: Appointment[];
};

export function AppointmentList({ appointments }: AppointmentListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingAppointmentId, setEditingAppointmentId] = React.useState<string | null>(null);
  const [newStatus, setNewStatus] = React.useState<Appointment['status']>('booked');

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

  const { mutate: removeAppointment } = useMutation({
    mutationFn: (id: string) => deleteAppointmentApi(id), // Use renamed import
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: 'Success',
        description: 'Appointment deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete appointment.',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      booked: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
      Urgent: 'warning',
    } as const;
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleEdit = (id: string, status: Appointment['status']) => {
    setEditingAppointmentId(id);
    setNewStatus(status); // Set the initial status when entering edit mode
  };

  const handleCancelEdit = () => {
    setEditingAppointmentId(null);
  };

  const handleSaveChanges = (id: string) => {
    updateStatus({ id, status: newStatus });
    setEditingAppointmentId(null); // Close edit mode
  };

  if (!Array.isArray(appointments)) {
    return null;
  }

  return (
    <div className="rounded-lg border">
       <div className="rounded-lg border">
      {/* Message for users */}
      <div className="p-4 bg-yellow-100 text-yellow-800 text-center rounded-t-lg">
        Please log in with your credentials to add or manage appointments.
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.user.name}</TableCell>
              <TableCell>{appointment.doctor.name}</TableCell>
              <TableCell>{appointment.doctor.specialization}</TableCell>
              <TableCell>
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {editingAppointmentId === appointment.id ? (
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Appointment['status'])}
                    className="border rounded px-2 py-1"
                  >
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                ) : (
                  getStatusBadge(appointment.status)
                )}
              </TableCell>
              <TableCell className="space-x-2">
                {editingAppointmentId === appointment.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveChanges(appointment.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(appointment.id, appointment.status)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAppointment(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
