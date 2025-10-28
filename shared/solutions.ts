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
  primaryDivision: string;
  secondaryDivisions?: string[];
  baseScore: number;
  averageCost: string;
  rating: number;
  projectsUsed: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
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

export interface CSIDivision {
  id: string;
  code: string;
  label: string;
  weight: number;
}

export const CSI_DIVISIONS: CSIDivision[] = [
  { id: "01", code: "01", label: "General Requirements", weight: 1 },
  { id: "03", code: "03", label: "Concrete", weight: 2 },
  { id: "04", code: "04", label: "Masonry", weight: 3 },
  { id: "05", code: "05", label: "Metals", weight: 4 },
  { id: "06", code: "06", label: "Wood, Plastics & Composites", weight: 5 },
  { id: "07", code: "07", label: "Thermal & Moisture Protection", weight: 6 },
  { id: "08", code: "08", label: "Openings", weight: 7 },
  { id: "09", code: "09", label: "Finishes", weight: 8 },
  { id: "21", code: "21", label: "Fire Suppression", weight: 9 },
  { id: "22", code: "22", label: "Plumbing", weight: 10 },
  { id: "23", code: "23", label: "HVAC", weight: 11 },
  { id: "26", code: "26", label: "Electrical", weight: 12 },
  { id: "27", code: "27", label: "Communications", weight: 13 },
  { id: "28", code: "28", label: "Electronic Safety & Security", weight: 14 },
];
