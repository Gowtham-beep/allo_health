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
import { deleteUser, updateUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'patient';
  createdAt: string;
};

type UserListProps = {
  users: User[];
};

export function UserList({ users }: UserListProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<User> & { password?: string }>({});

  const { mutate: removeUser } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete user.',
        variant: 'destructive',
      });
    },
  });

  const { mutate: editUser } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> & { password?: string } }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUserId(null);
      setUpdatedUser({});
      toast({
        title: 'Success',
        description: 'User updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update user.',
        variant: 'destructive',
      });
    },
  });

  const startEditing = (user: User) => {
    setEditingUserId(user.id);
    setUpdatedUser({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setUpdatedUser({});
  };

  const saveChanges = () => {
    if (editingUserId) {
      const dataToUpdate: Partial<User> & { password?: string } = {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      };

      // Only send updated password if it has a value
      if (updatedUser.password) {
        dataToUpdate.password = updatedUser.password;
      }

      editUser({ id: editingUserId, data: dataToUpdate });
    }
  };

  if (!Array.isArray(users)) {
    return null;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={updatedUser.name || ''}
                    onChange={(e) =>
                      setUpdatedUser((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    value={updatedUser.email || ''}
                    onChange={(e) =>
                      setUpdatedUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingUserId === user.id ? (
                  <select
                    value={updatedUser.role || ''}
                    onChange={(e) =>
                      setUpdatedUser((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="staff">Staff</option>
                    <option value="patient">Patient</option>
                  </select>
                ) : (
                  <Badge
                    variant={user.role === 'staff' ? 'default' : 'secondary'}
                  >
                    {user.role}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="space-x-2">
                {editingUserId === user.id ? (
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
                      onClick={() => startEditing(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUser(user.id)}
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
