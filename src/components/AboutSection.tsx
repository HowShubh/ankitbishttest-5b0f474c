import profileImage from "@/assets/profile.jpg";
import OptimizedImage from "@/components/OptimizedImage";

interface TimelineItem {
  title: string;
  company: string;
  period: string;
}

const timeline: TimelineItem[] = [
  { title: "Creative Producer", company: "KK.Create", period: "2024 - Present" },
  { title: "Video Editor", company: "Pixel Studios", period: "2020 - 2023" },
  { title: "Education", company: "Film & Television Institute", period: "2017 - 2020" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 scroll-mt-20">
      <h2 className="text-2xl font-semibold mb-6">About Me</h2>
      
      <div className="grid md:grid-cols-[1fr,auto] gap-10">
        <div className="space-y-8">
          <p className="text-muted-foreground leading-relaxed">
            Creative and detail-oriented producer and editor with a passion for storytelling 
            through visual media. Experienced in managing projects from concept to final 
            delivery, with expertise in color grading, sound design, and narrative structure.
          </p>
          
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="relative flex gap-4">
                {index < timeline.length - 1 && <div className="timeline-line" />}
                <div className="timeline-dot" />
                <div className="flex-1 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.company}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="hidden md:block">
          <OptimizedImage 
            src={profileImage} 
            alt="Ankit Bisht" 
            className="w-48 h-60 rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
