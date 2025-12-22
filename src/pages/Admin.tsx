import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useTogglePinProject, type Project, type ProjectFormData } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ProjectForm from '@/components/admin/ProjectForm';
import { Plus, Pencil, Trash2, LogOut, Pin } from 'lucide-react';

export default function Admin() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const togglePin = useTogglePinProject();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">You don't have admin access.</p>
            <Button onClick={() => navigate('/')}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreate = async (data: ProjectFormData) => {
    await createProject.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: ProjectFormData) => {
    if (editingProject) {
      await updateProject.mutateAsync({ id: editingProject.id, ...data });
      setEditingProject(null);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProject.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleTogglePin = async (project: Project) => {
    await togglePin.mutateAsync({ id: project.id, is_pinned: !project.is_pinned });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </Button>
        </div>

        <div className="grid gap-4">
          {projects?.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {project.thumbnail_url && (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-24 h-18 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.role} • {project.client} • {project.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Pin className={`w-4 h-4 ${project.is_pinned ? 'text-primary' : 'text-muted-foreground'}`} />
                      <Switch
                        checked={project.is_pinned}
                        onCheckedChange={() => handleTogglePin(project)}
                      />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setEditingProject(project)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(project.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects?.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No projects yet. Create your first one!</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Create Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={createProject.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              initialData={{
                title: editingProject.title,
                role: editingProject.role,
                client: editingProject.client || '',
                year: editingProject.year || '',
                description: editingProject.description || '',
                thumbnail_url: editingProject.thumbnail_url || '',
                youtube_url: editingProject.youtube_url || '',
                gallery: editingProject.gallery || [],
                is_pinned: editingProject.is_pinned,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingProject(null)}
              isLoading={updateProject.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
