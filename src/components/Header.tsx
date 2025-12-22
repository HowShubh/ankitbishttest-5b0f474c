import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-semibold tracking-tight hover:text-primary transition-colors">
          Ankit Bisht
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/projects" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/projects' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Projects
          </Link>
          <Link 
            to="/#about" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About Me
          </Link>
        </nav>
        
        <a href="mailto:ankit.bisht@email.com">
          <Button variant="outline" size="sm" className="border-foreground/20 hover:bg-foreground hover:text-background">
            Contact Me
          </Button>
        </a>
      </div>
    </header>
  );
};

export default Header;
