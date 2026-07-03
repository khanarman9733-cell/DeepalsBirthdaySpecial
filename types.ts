export interface ConstellationStar {
  id: string;
  name: string;
  title: string;
  coordinates: { x: number; y: number }; // Percentage from top-left (0-100)
  description: string;
  quote: string;
  icon: string; // Lucide icon name
}

export interface GalleryChapter {
  id: string;
  title: string;
  subtitle: string;
  symbolism: string;
  description: string;
  imageSeed: string; // Seed for picsum placeholder
  gradient: string;  // Tailwind gradient styling
}

export interface UserWish {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  x: number; // Starting animation X coordinate
  size: number;
}
