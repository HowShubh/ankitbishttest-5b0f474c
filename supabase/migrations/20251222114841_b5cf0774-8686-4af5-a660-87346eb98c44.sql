-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for proper authorization
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy for user_roles - users can read their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  client TEXT,
  year TEXT,
  description TEXT,
  thumbnail_url TEXT,
  youtube_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read access for projects
CREATE POLICY "Anyone can view projects"
ON public.projects
FOR SELECT
USING (true);

-- Only admins can insert projects
CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update projects
CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete projects
CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();