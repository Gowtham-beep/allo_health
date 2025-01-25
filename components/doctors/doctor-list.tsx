'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteDoctor, updateDoctor } from '@/lib/api'; // Make sure you have updateDoctor function
import { useToast } from '@/hooks/use-toast';

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  gender: string;
  location: string;
  availability: string;
};

type DoctorListProps = {
  doctors: Doctor[];
};

export function DoctorList({ doctors }: DoctorListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [updatedDoctor, setUpdatedDoctor] = useState<Partial<Doctor>>({});

  const { mutate: removeDoctor } = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: 'Success',
        description: 'Doctor deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete doctor.',
        variant: 'destructive',
      });
    },
  });

  const { mutate: editDoctor } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Doctor> }) =>
      updateDoctor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      setEditingDoctorId(null);
      setUpdatedDoctor({});
      toast({
        title: 'Success',
        description: 'Doctor updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update doctor.',
        variant: 'destructive',
      });
    },
  });

  const startEditing = (doctor: Doctor) => {
    setEditingDoctorId(doctor.id);
    setUpdatedDoctor({
      name: doctor.name,
      specialization: doctor.specialization,
      gender: doctor.gender,
      location: doctor.location,
      availability: doctor.availability,
    });
  };

  const cancelEditing = () => {
    setEditingDoctorId(null);
    setUpdatedDoctor({});
  };

  const saveChanges = () => {
    if (editingDoctorId) {
      const dataToUpdate: Partial<Doctor> = {
        name: updatedDoctor.name,
        specialization: updatedDoctor.specialization,
        gender: updatedDoctor.gender,
        location: updatedDoctor.location,
        availability: updatedDoctor.availability,
      };

      editDoctor({ id: editingDoctorId, data: dataToUpdate });
    }
  };

  if (!Array.isArray(doctors)) {
    return null;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                {editingDoctorId === doctor.id ? (
                  <input
                    type="text"
                    value={updatedDoctor.name || ''}
                    onChange={(e) =>
                      setUpdatedDoctor((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  doctor.name
                )}
              </TableCell>
              <TableCell>
                {editingDoctorId === doctor.id ? (
                  <input
                    type="text"
                    value={updatedDoctor.specialization || ''}
                    onChange={(e) =>
                      setUpdatedDoctor((prev) => ({ ...prev, specialization: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  doctor.specialization
                )}
              </TableCell>
              <TableCell>
                {editingDoctorId === doctor.id ? (
                  <input
                    type="text"
                    value={updatedDoctor.gender || ''}
                    onChange={(e) =>
                      setUpdatedDoctor((prev) => ({ ...prev, gender: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  doctor.gender
                )}
              </TableCell>
              <TableCell>
                {editingDoctorId === doctor.id ? (
                  <input
                    type="text"
                    value={updatedDoctor.location || ''}
                    onChange={(e) =>
                      setUpdatedDoctor((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  doctor.location
                )}
              </TableCell>
              <TableCell>
                {editingDoctorId === doctor.id ? (
                  <input
                    type="text"
                    value={updatedDoctor.availability || ''}
                    onChange={(e) =>
                      setUpdatedDoctor((prev) => ({ ...prev, availability: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  doctor.availability
                )}
              </TableCell>
              <TableCell className="space-x-2">
                {editingDoctorId === doctor.id ? (
                  <>
                    <Button variant="ghost" size="icon" onClick={saveChanges}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(doctor)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDoctor(doctor.id)}
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
  );
}
