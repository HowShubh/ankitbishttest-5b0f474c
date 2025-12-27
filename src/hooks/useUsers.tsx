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
      // Fetch all user roles with profile emails
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at');

      if (rolesError) throw rolesError;

      // Fetch profiles to get emails
      const userIds = roles.map((r) => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create email lookup map
      const emailMap = new Map(profiles?.map((p) => [p.user_id, p.email]) || []);

      // Map roles with emails
      return roles.map((role) => ({
        user_id: role.user_id,
        email: emailMap.get(role.user_id) || '',
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
