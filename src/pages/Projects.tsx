import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/hooks/useProjects";

const Projects = () => {
  const { data: projects, isLoading } = useProjects();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Projects</h1>
          <p className="text-muted-foreground">
            A complete collection of my work as a producer and editor.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="portfolio-grid">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
