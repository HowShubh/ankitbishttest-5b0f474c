import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Settings, LogOut } from "lucide-react";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
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
          <a 
            href="/#about" 
            onClick={handleAboutClick}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
          >
            About Me
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
          {user ? (
            <Button variant="outline" size="sm" onClick={signOut} className="gap-2 border-foreground/20 hover:bg-foreground hover:text-background">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <a href="mailto:ankit.bisht@email.com">
              <Button variant="outline" size="sm" className="border-foreground/20 hover:bg-foreground hover:text-background">
                Contact Me
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
