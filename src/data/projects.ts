import project1 from "@/assets/projects/project1.jpg";
import project2 from "@/assets/projects/project2.jpg";
import project3 from "@/assets/projects/project3.jpg";
import project4 from "@/assets/projects/project4.jpg";
import project5 from "@/assets/projects/project5.jpg";
import project6 from "@/assets/projects/project6.jpg";

export interface Project {
  id: string;
  title: string;
  role: string;
  client: string;
  year: string;
  thumbnail: string;
  description: string;
  youtubeUrl?: string;
  gallery: string[];
  isPinned: boolean;
}

export const projects: Project[] = [
  {
    id: "sunset-campaign",
    title: "Sunset Campaign 2024",
    role: "Producer",
    client: "Nike Athletics",
    year: "2024",
    thumbnail: project1,
    description: "A cinematic commercial capturing athletes training at golden hour. This project involved coordinating a 20-person crew across multiple locations to create a visually stunning narrative about perseverance and dedication.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gallery: [project1, project3, project4],
    isPinned: true,
  },
  {
    id: "editing-suite",
    title: "Documentary Series",
    role: "Editor",
    client: "Netflix",
    year: "2024",
    thumbnail: project2,
    description: "Lead editor for a 6-part documentary series exploring urban culture. Responsible for color grading, sound design, and narrative pacing across over 200 hours of raw footage.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gallery: [project2, project5, project6],
    isPinned: true,
  },
  {
    id: "beach-commercial",
    title: "Summer Collection",
    role: "Producer",
    client: "H&M",
    year: "2024",
    thumbnail: project3,
    description: "Produced a vibrant beach commercial showcasing the latest summer fashion collection. Managed logistics for a week-long shoot in Thailand with international talent.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gallery: [project3, project1, project4],
    isPinned: true,
  },
  {
    id: "interview-series",
    title: "Voices of Change",
    role: "Editor",
    client: "Vice Media",
    year: "2023",
    thumbnail: project4,
    description: "Edited an impactful interview series featuring activists and thought leaders. Created a cohesive visual style that honored each subject's unique story.",
    gallery: [project4, project2, project6],
    isPinned: true,
  },
  {
    id: "music-video",
    title: "Neon Dreams",
    role: "Producer",
    client: "Sony Music",
    year: "2023",
    thumbnail: project5,
    description: "Produced a high-energy music video with elaborate lighting setups and fog effects. Coordinated with the artist's creative team to bring their vision to life.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    gallery: [project5, project1, project2],
    isPinned: true,
  },
  {
    id: "corporate-brand",
    title: "Tech Forward",
    role: "Editor",
    client: "Microsoft",
    year: "2023",
    thumbnail: project6,
    description: "Edited a corporate brand film highlighting innovation and workplace culture. Delivered multiple versions optimized for various platforms and audiences.",
    gallery: [project6, project4, project3],
    isPinned: true,
  },
];
