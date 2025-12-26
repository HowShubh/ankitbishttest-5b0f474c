import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserWithRole {
  user_id: string;
  email: string;
  role: 'admin' | 'user' | null;
  created_at: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async (): Promise<UserWithRole[]> => {
      // Fetch all user roles (admins can see all)
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at');

      if (rolesError) throw rolesError;

      // Map roles to user format
      return roles.map((role) => ({
        user_id: role.user_id,
        email: '', // We'll need to display user_id since we can't access auth.users
        role: role.role as 'admin' | 'user',
        created_at: role.created_at,
      }));
    },
  });
};

export const useGrantAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast.success('Admin access granted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to grant admin access: ${error.message}`);
    },
  });
};

export const useRevokeAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast.success('Admin access revoked');
    },
    onError: (error: Error) => {
      toast.error(`Failed to revoke admin access: ${error.message}`);
    },
  });
};
