import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  role: string;
  client: string | null;
  year: string | null;
  description: string | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  gallery: string[] | null;
  is_pinned: boolean | null;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <Link 
      to={`/project/${project.id}`}
      className="project-card group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden">
        <img 
          src={project.thumbnail_url || '/placeholder.svg'} 
          alt={project.title}
          className="project-card-image group-hover:scale-105 transition-transform duration-500"
        />
        
        {project.youtube_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>
      
      <div className="p-3 space-y-1">
        <p className="text-xs text-muted-foreground">{project.client || 'Personal'} • {project.role}</p>
        <h3 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
          {project.title}
        </h3>
      </div>
    </Link>
  );
};

export default ProjectCard;
