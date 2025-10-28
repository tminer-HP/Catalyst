import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import NavHeader from "@/components/NavHeader";
import SearchBar from "@/components/SearchBar";
import FilterChips from "@/components/FilterChips";
import SolutionCard from "@/components/SolutionCard";
import { mockSolutions } from "@shared/mockData";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const filteredSolutions = useMemo(() => {
    return mockSolutions.filter((solution) => {
      const matchesSearch =
        !searchQuery ||
        solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        solution.categories.some((cat) => selectedCategories.includes(cat));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategories]);

  const handleSolutionClick = (id: string) => {
    setLocation(`/solution/${id}`);
  };

  return (
    <div className="min-h-screen">
      <NavHeader />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Explore Solutions
          </h1>
          <p className="text-muted-foreground">
            Discover and compare construction technology innovations
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by company, technology, or use case..."
          />

          <div className="flex flex-wrap items-center gap-4">
            <FilterChips
              selectedCategories={selectedCategories}
              onToggleCategory={handleToggleCategory}
            />
            {(selectedCategories.length > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                data-testid="button-clear-filters"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

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
            <Button variant="outline" onClick={handleClearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
