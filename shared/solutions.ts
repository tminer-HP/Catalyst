export interface Solution {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  categories: string[];
  location: string;
  founded: string;
  teamSize: string;
  website: string;
  features: string[];
  useCases: string[];
  relatedIds: string[];
}

export const CATEGORIES = [
  "Robotics",
  "Safety",
  "AI",
  "Sustainability",
  "Productivity",
] as const;

export type Category = typeof CATEGORIES[number];
