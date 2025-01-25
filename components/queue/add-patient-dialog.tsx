'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addToQueue } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  queueNumber: z.string().transform((val) => parseInt(val, 10)), // Convert string to number
  status: z.enum(['Waiting', 'With Doctor', 'Completed']),
  user: z.string().transform((val) => parseInt(val, 10)), // Convert string to number
  doctor: z.string().transform((val) => parseInt(val, 10)), // Convert string to number
  createdAt: z.string(),
});


type FormValues = z.infer<typeof formSchema>;

export function AddPatientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      queueNumber: 1,
      status: 'Waiting',
      user: 1,
      doctor: 1,
      createdAt: new Date().toISOString(),
    },
  });

  const { mutate: addPatient, isPending } = useMutation({
    mutationFn: (data: FormValues) => addToQueue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      toast({
        title: 'Success',
        description: 'Patient added to queue successfully.',
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add patient to queue.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => addPatient(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="queueNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Queue Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter queue number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Waiting">Waiting</SelectItem>
                      <SelectItem value="With Doctor">With Doctor</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter user ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter doctor ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Created At</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Enter created time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Patient'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
