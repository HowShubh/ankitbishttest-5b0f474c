import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import AboutSection from "@/components/AboutSection";
import { projects } from "@/data/projects";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        {/* Projects Grid */}
        <section id="projects" className="scroll-mt-20">
          <div className="portfolio-grid">
            {projects.map((project, index) => (
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
