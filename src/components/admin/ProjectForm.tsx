import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ProjectFormData } from '@/hooks/useProjects';

const ROLES = ['Producer', 'Editor', 'Director', 'Cinematographer', 'Producer/Editor'];

interface ProjectFormProps {
  initialData?: ProjectFormData & { id?: string };
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProjectForm({ initialData, onSubmit, onCancel, isLoading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    role: initialData?.role || '',
    client: initialData?.client || '',
    year: initialData?.year || new Date().getFullYear().toString(),
    description: initialData?.description || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    youtube_url: initialData?.youtube_url || '',
    gallery: initialData?.gallery || [],
    is_pinned: initialData?.is_pinned || false,
  });

  const [uploading, setUploading] = useState(false);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-thumbnail.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    setFormData(prev => ({ ...prev, thumbnail_url: urlData.publicUrl }));
    setUploading(false);
    toast({ title: 'Thumbnail uploaded' });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...uploadedUrls],
    }));
    setUploading(false);
    toast({ title: `${uploadedUrls.length} images uploaded` });
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.role) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter project title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
            placeholder="Client name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the project..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Thumbnail Image</Label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={uploading}
          />
        </div>
        {formData.thumbnail_url && (
          <img
            src={formData.thumbnail_url}
            alt="Thumbnail preview"
            className="w-32 h-24 object-cover rounded-md mt-2"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label>Gallery Images</Label>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          disabled={uploading}
        />
        {formData.gallery && formData.gallery.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.gallery.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-20 h-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube_url">YouTube URL</Label>
        <Input
          id="youtube_url"
          value={formData.youtube_url}
          onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="is_pinned"
          checked={formData.is_pinned}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_pinned: checked }))}
        />
        <Label htmlFor="is_pinned">Pin to Homepage</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading || uploading}>
          {isLoading ? 'Saving...' : initialData?.title ? 'Update Project' : 'Save Project'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
