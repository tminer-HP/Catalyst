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
  { id: "01", code: "01", label: "Division 01 - General Requirements", weight: 1 },
  { id: "02", code: "02", label: "Division 02 - Existing Conditions", weight: 2 },
  { id: "03", code: "03", label: "Division 03 - Concrete", weight: 3 },
  { id: "04", code: "04", label: "Division 04 - Masonry", weight: 4 },
  { id: "05", code: "05", label: "Division 05 - Metals", weight: 5 },
  { id: "06", code: "06", label: "Division 06 - Wood, Plastics & Composites", weight: 6 },
  { id: "07", code: "07", label: "Division 07 - Thermal & Moisture Protection", weight: 7 },
  { id: "08", code: "08", label: "Division 08 - Openings", weight: 8 },
  { id: "09", code: "09", label: "Division 09 - Finishes", weight: 9 },
  { id: "10", code: "10", label: "Division 10 - Specialties", weight: 10 },
  { id: "11", code: "11", label: "Division 11 - Equipment", weight: 11 },
  { id: "12", code: "12", label: "Division 12 - Furnishings", weight: 12 },
  { id: "13", code: "13", label: "Division 13 - Special Construction", weight: 13 },
  { id: "14", code: "14", label: "Division 14 - Conveying Equipment", weight: 14 },
  { id: "21", code: "21", label: "Division 21 - Fire Suppression", weight: 15 },
  { id: "22", code: "22", label: "Division 22 - Plumbing", weight: 16 },
  { id: "23", code: "23", label: "Division 23 - HVAC", weight: 17 },
  { id: "25", code: "25", label: "Division 25 - Integrated Automation", weight: 18 },
  { id: "26", code: "26", label: "Division 26 - Electrical", weight: 19 },
  { id: "27", code: "27", label: "Division 27 - Communications", weight: 20 },
  { id: "28", code: "28", label: "Division 28 - Electronic Safety & Security", weight: 21 },
  { id: "31", code: "31", label: "Division 31 - Earthwork", weight: 22 },
  { id: "32", code: "32", label: "Division 32 - Exterior Improvements", weight: 23 },
  { id: "33", code: "33", label: "Division 33 - Utilities", weight: 24 },
  { id: "34", code: "34", label: "Division 34 - Transportation", weight: 25 },
  { id: "35", code: "35", label: "Division 35 - Waterway & Marine Construction", weight: 26 },
  { id: "40", code: "40", label: "Division 40 - Process Integration", weight: 27 },
  { id: "41", code: "41", label: "Division 41 - Material Processing & Handling", weight: 28 },
  { id: "42", code: "42", label: "Division 42 - Process Heating, Cooling & Drying", weight: 29 },
  { id: "43", code: "43", label: "Division 43 - Process Gas & Liquid Handling", weight: 30 },
  { id: "44", code: "44", label: "Division 44 - Pollution & Waste Control", weight: 31 },
  { id: "45", code: "45", label: "Division 45 - Industry-Specific Manufacturing", weight: 32 },
  { id: "46", code: "46", label: "Division 46 - Water & Wastewater Equipment", weight: 33 },
  { id: "48", code: "48", label: "Division 48 - Electrical Power Generation", weight: 34 },
];
