import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CATEGORIES, REGIONS, VERTICALS, type Solution } from "@shared/solutions";
import { mockSolutions, mockProjects } from "@shared/mockData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Filters {
  verticals: string[];
  categories: string[];
  regions: string[];
  teamSizes: string[];
}

const TEAM_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
];

export default function Solutions() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { addToHistory } = useSearchHistory();
  
  const [filters, setFilters] = useState<Filters>({
    verticals: [],
    categories: [],
    regions: [],
    teamSizes: [],
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const newFilters: Filters = {
      verticals: [],
      categories: [],
      regions: [],
      teamSizes: [],
    };

    const verticalParam = searchParams.get("v");
    if (verticalParam && VERTICALS.includes(verticalParam as any)) {
      newFilters.verticals = [verticalParam];
    }

    const categoryParam = searchParams.get("c");
    if (categoryParam && CATEGORIES.includes(categoryParam as any)) {
      newFilters.categories = [categoryParam];
    }

    const projectParam = searchParams.get("p");
    if (projectParam) {
      const project = mockProjects.find(p => p.id === projectParam);
      if (project) {
        if (project.vertical && VERTICALS.includes(project.vertical as any)) {
          newFilters.verticals = [project.vertical];
        }
      }
    }

    const queryParam = searchParams.get("q");
    if (queryParam) {
    }

    setFilters(newFilters);
  }, [search]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({
      verticals: [],
      categories: [],
      regions: [],
      teamSizes: [],
    });
  };

  const filteredSolutions = mockSolutions.filter(solution => {
    if (filters.verticals.length > 0) {
      const hasVertical = filters.verticals.some(v => solution.verticals.includes(v));
      if (!hasVertical) return false;
    }

    if (filters.categories.length > 0) {
      const hasCategory = filters.categories.some(c => solution.categories.includes(c));
      if (!hasCategory) return false;
    }

    if (filters.regions.length > 0) {
      const hasRegion = filters.regions.some(r => solution.region.includes(r));
      if (!hasRegion) return false;
    }

    if (filters.teamSizes.length > 0) {
      const hasTeamSize = filters.teamSizes.some(ts => {
        const teamSize = solution.teamSize;
        if (ts === "1-10" && (teamSize.includes("1-") || teamSize.includes("5-") || teamSize === "1-10")) return true;
        if (ts === "11-50" && (teamSize.includes("15-") || teamSize.includes("20-") || teamSize.includes("25-") || teamSize.includes("30-") || teamSize === "11-50")) return true;
        if (ts === "51-200" && (teamSize.includes("50-") || teamSize.includes("100-") || teamSize === "51-200")) return true;
        if (ts === "201-500" && (teamSize.includes("200-") || teamSize.includes("500-") || teamSize === "201-500")) return true;
        if (ts === "500+" && teamSize.includes("1000+")) return true;
        return false;
      });
      if (!hasTeamSize) return false;
    }

    return true;
  });

  const activeFilterCount = 
    filters.verticals.length + 
    filters.categories.length + 
    filters.regions.length + 
    filters.teamSizes.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl font-bold">Solutions</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredSolutions.length} {filteredSolutions.length === 1 ? 'solution' : 'solutions'} found
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  <h2 className="font-display text-lg font-bold">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" data-testid="badge-filter-count">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    data-testid="button-clear-filters"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold hover:no-underline"
                      data-testid="button-toggle-verticals"
                    >
                      <span>Vertical Market</span>
                      <ChevronDown className="w-4 h-4 transition-transform ui-expanded:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    {VERTICALS.map(vertical => (
                      <div key={vertical} className="flex items-center gap-2">
                        <Checkbox
                          id={`vertical-${vertical}`}
                          checked={filters.verticals.includes(vertical)}
                          onCheckedChange={() => toggleFilter('verticals', vertical)}
                          data-testid={`checkbox-vertical-${vertical.toLowerCase()}`}
                        />
                        <Label
                          htmlFor={`vertical-${vertical}`}
                          className="text-sm cursor-pointer"
                        >
                          {vertical}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold hover:no-underline"
                      data-testid="button-toggle-categories"
                    >
                      <span>Category</span>
                      <ChevronDown className="w-4 h-4 transition-transform ui-expanded:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    {CATEGORIES.map(category => (
                      <div key={category} className="flex items-center gap-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleFilter('categories', category)}
                          data-testid={`checkbox-category-${category.toLowerCase()}`}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold hover:no-underline"
                      data-testid="button-toggle-regions"
                    >
                      <span>Region</span>
                      <ChevronDown className="w-4 h-4 transition-transform ui-expanded:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    {REGIONS.map(region => (
                      <div key={region} className="flex items-center gap-2">
                        <Checkbox
                          id={`region-${region}`}
                          checked={filters.regions.includes(region)}
                          onCheckedChange={() => toggleFilter('regions', region)}
                          data-testid={`checkbox-region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label
                          htmlFor={`region-${region}`}
                          className="text-sm cursor-pointer"
                        >
                          {region}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Separator />

                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto font-semibold hover:no-underline"
                      data-testid="button-toggle-team-size"
                    >
                      <span>Team Size</span>
                      <ChevronDown className="w-4 h-4 transition-transform ui-expanded:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3">
                    {TEAM_SIZES.map(size => (
                      <div key={size} className="flex items-center gap-2">
                        <Checkbox
                          id={`teamsize-${size}`}
                          checked={filters.teamSizes.includes(size)}
                          onCheckedChange={() => toggleFilter('teamSizes', size)}
                          data-testid={`checkbox-teamsize-${size.toLowerCase().replace(/\+/g, 'plus')}`}
                        />
                        <Label
                          htmlFor={`teamsize-${size}`}
                          className="text-sm cursor-pointer"
                        >
                          {size} employees
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {filteredSolutions.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="font-display text-xl font-bold mb-2">No solutions found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={clearFilters} data-testid="button-clear-filters-empty">
                    Clear all filters
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSolutions.map(solution => (
                  <Card
                    key={solution.id}
                    className="p-6 hover-elevate active-elevate-2 transition-all cursor-pointer"
                    data-testid={`card-solution-${solution.id}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary">
                          {solution.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold mb-1" data-testid={`text-solution-name-${solution.id}`}>
                          {solution.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {solution.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {solution.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {solution.categories.slice(0, 3).map(category => (
                        <Badge key={category} variant="secondary" data-testid={`badge-category-${category.toLowerCase()}`}>
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{solution.location}</span>
                      <span>{solution.teamSize} team</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
