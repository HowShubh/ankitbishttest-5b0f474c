import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import AboutSection from "@/components/AboutSection";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";

const Index = () => {
  const pinnedProjects = projects.filter((project) => project.isPinned);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Featured Projects Grid */}
        <section id="projects" className="scroll-mt-20">
          <div className="flex justify-end mb-6">
            <Link to="/projects">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="portfolio-grid">
            {pinnedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>
        
        {/* About Section */}
        <AboutSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
