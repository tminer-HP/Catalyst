export interface Solution {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  categories: string[];
  region: string[];
  verticals: string[];
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
  "Estimating",
  "Scheduling",
  "Layout",
] as const;

export const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
] as const;

export const VERTICALS = [
  "Commercial",
  "Datacenter",
  "Airport",
  "Hospital",
  "Residential",
  "Industrial",
  "Infrastructure",
] as const;

export type Category = typeof CATEGORIES[number];
export type Region = typeof REGIONS[number];
export type Vertical = typeof VERTICALS[number];
