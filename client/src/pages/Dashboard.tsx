import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import NavHeader from "@/components/NavHeader";
import FilterSidebar from "@/components/FilterSidebar";
import SolutionCard from "@/components/SolutionCard";
import { mockSolutions } from "@shared/mockData";
import { aiSearchSolutions } from "@/utils/aiSearch";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleToggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleToggleVertical = (vertical: string) => {
    setSelectedVerticals((prev) =>
      prev.includes(vertical)
        ? prev.filter((v) => v !== vertical)
        : [...prev, vertical]
    );
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedVerticals([]);
  };

  const filteredSolutions = useMemo(() => {
    let results = mockSolutions;

    // Apply AI search if there's a query
    if (searchQuery.trim()) {
      results = aiSearchSolutions(searchQuery, results);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter((solution) =>
        solution.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Apply region filter
    if (selectedRegions.length > 0) {
      results = results.filter((solution) =>
        solution.region.some((reg) => selectedRegions.includes(reg))
      );
    }

    // Apply vertical filter
    if (selectedVerticals.length > 0) {
      results = results.filter((solution) =>
        solution.verticals.some((vert) => selectedVerticals.includes(vert))
      );
    }

    return results;
  }, [searchQuery, selectedCategories, selectedRegions, selectedVerticals]);

  const handleSolutionClick = (id: string) => {
    setLocation(`/solution/${id}`);
  };

  const activeFilters = [
    ...selectedCategories.map((c) => ({ type: "Category", value: c })),
    ...selectedRegions.map((r) => ({ type: "Region", value: r })),
    ...selectedVerticals.map((v) => ({ type: "Vertical", value: v })),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader />

      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          selectedRegions={selectedRegions}
          onToggleRegion={handleToggleRegion}
          selectedVerticals={selectedVerticals}
          onToggleVertical={handleToggleVertical}
          onClearAll={handleClearAll}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Explore Solutions
              </h1>
              {searchQuery && (
                <p className="text-muted-foreground">
                  AI search results for: <span className="font-medium text-foreground">"{searchQuery}"</span>
                </p>
              )}
            </div>

            {activeFilters.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {activeFilters.map((filter, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs"
                    >
                      {filter.type}: {filter.value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                {filteredSolutions.length} {filteredSolutions.length === 1 ? "solution" : "solutions"} found
              </p>
            </div>

            {filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No solutions found matching your criteria
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {filteredSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    onClick={() => handleSolutionClick(solution.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
