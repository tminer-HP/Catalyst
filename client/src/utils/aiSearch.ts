import type { Solution } from "@shared/solutions";

// AI-powered search that understands natural language queries
// and surfaces relevant solutions based on context
export function aiSearchSolutions(query: string, solutions: Solution[]): Solution[] {
  if (!query.trim()) {
    return solutions;
  }

  const lowerQuery = query.toLowerCase();
  
  // Define keyword mappings for intelligent search
  const searchMappings = {
    // Use case queries
    "layout": ["layout"],
    "layout robotics": ["layout", "robotics"],
    "estimating": ["estimating"],
    "scheduling": ["scheduling"],
    "safety": ["safety"],
    "drywall": ["robotics", "productivity"],
    "bim": ["layout", "productivity"],
    
    // Vertical-specific queries
    "datacenter": ["datacenter"],
    "datacenters": ["datacenter"],
    "airport": ["airport"],
    "hospital": ["hospital"],
    "commercial": ["commercial"],
    "residential": ["residential"],
    "industrial": ["industrial"],
    
    // Technology queries
    "robot": ["robotics"],
    "robotics": ["robotics"],
    "ai": ["ai"],
    "automation": ["robotics", "productivity"],
    
    // Role-based queries
    "superintendent": ["layout", "robotics", "productivity"],
    "estimator": ["estimating"],
    "project manager": ["scheduling", "productivity"],
    "safety manager": ["safety"],
  };

  // Score each solution based on relevance
  const scoredSolutions = solutions.map((solution) => {
    let score = 0;
    
    // Direct name match (highest priority)
    if (solution.name.toLowerCase().includes(lowerQuery)) {
      score += 100;
    }
    
    // Tagline match
    if (solution.tagline.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }
    
    // Description match
    if (solution.description.toLowerCase().includes(lowerQuery)) {
      score += 20;
    }
    
    // Category matches from intelligent mappings
    for (const [keyword, categories] of Object.entries(searchMappings)) {
      if (lowerQuery.includes(keyword)) {
        const matchingCategories = solution.categories.filter((cat) =>
          categories.some((mappedCat) => cat.toLowerCase().includes(mappedCat))
        );
        score += matchingCategories.length * 30;
      }
    }
    
    // Vertical matches from intelligent mappings
    for (const [keyword, verticals] of Object.entries(searchMappings)) {
      if (lowerQuery.includes(keyword)) {
        const matchingVerticals = solution.verticals.filter((vert) =>
          verticals.some((mappedVert) => vert.toLowerCase().includes(mappedVert))
        );
        score += matchingVerticals.length * 25;
      }
    }
    
    // Direct category match
    solution.categories.forEach((category) => {
      if (lowerQuery.includes(category.toLowerCase())) {
        score += 40;
      }
    });
    
    // Direct vertical match
    solution.verticals.forEach((vertical) => {
      if (lowerQuery.includes(vertical.toLowerCase())) {
        score += 35;
      }
    });
    
    // Direct region match
    solution.region.forEach((region) => {
      if (lowerQuery.includes(region.toLowerCase())) {
        score += 30;
      }
    });
    
    // Features match
    solution.features.forEach((feature) => {
      if (feature.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }
    });
    
    // Use cases match
    solution.useCases.forEach((useCase) => {
      if (useCase.toLowerCase().includes(lowerQuery)) {
        score += 15;
      }
    });
    
    return { solution, score };
  });

  // Filter and sort by score
  return scoredSolutions
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.solution);
}
