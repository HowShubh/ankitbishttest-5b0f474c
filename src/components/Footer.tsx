import { Instagram, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Details:</h3>
            <div className="space-y-2">
              <a href="mailto:ankitbisht@kkcreate.in" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                ankitbisht@kkcreate.in
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                +91 81262 32362 
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Delhi, India
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://instagram.com/behindthebisht" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.youtube.com/@behindthebisht" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/ankitxbisht" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ankit Bisht. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
