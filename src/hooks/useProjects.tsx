import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  role: string;
  client: string | null;
  year: string | null;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  gallery: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  title: string;
  role: string;
  client?: string;
  year?: string;
  description?: string;
  thumbnail_url?: string;
  youtube_url?: string;
  gallery?: string[];
  is_pinned?: boolean;
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });
}

export function usePinnedProjects() {
  return useQuery({
    queryKey: ['projects', 'pinned'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_pinned', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: ProjectFormData) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error creating project', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...project }: ProjectFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating project', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting project', description: error.message, variant: 'destructive' });
    },
  });
}

export function useTogglePinProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_pinned }: { id: string; is_pinned: boolean }) => {
      const { data, error } = await supabase
        .from('projects')
        .update({ is_pinned })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: data.is_pinned ? 'Project pinned to homepage' : 'Project unpinned' });
    },
    onError: (error) => {
      toast({ title: 'Error updating project', description: error.message, variant: 'destructive' });
    },
  });
}
