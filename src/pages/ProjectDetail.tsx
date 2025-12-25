import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";

const ProjectDetail = () => {
  const { id } = useParams();
  const { data: project, isLoading } = useProject(id);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <p className="text-muted-foreground">Loading project...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Project not found</h1>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Back Button */}
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        
        {/* Hero Image */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <img 
            src={project.thumbnail_url || '/placeholder.svg'} 
            alt={project.title}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
        
        {/* Project Info Grid */}
        <div className="grid md:grid-cols-[1fr,280px] gap-8 mb-10">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold">{project.title}</h1>
            <p className="text-muted-foreground leading-relaxed">
              {project.description || 'No description available.'}
            </p>
          </div>
          
          <div className="space-y-4 p-5 bg-card rounded-lg border border-border">
            <div>
              <span className="text-xs text-muted-foreground">Role</span>
              <p className="font-medium">{project.role}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Client</span>
              <p className="font-medium">{project.client || 'Personal'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Year</span>
              <p className="font-medium">{project.year || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.gallery.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${project.title} gallery ${index + 1}`}
                    className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Video Section */}
        {project.youtube_url && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Video</h2>
            <div className="relative aspect-video bg-card rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer">
              <img 
                src={project.thumbnail_url || '/placeholder.svg'} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <a 
                href={project.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
              </a>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectDetail;
