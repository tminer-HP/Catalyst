import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, SlidersHorizontal, X, ChevronDown, ChevronRight } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useSelectedSolutions } from "@/hooks/useSelectedSolutions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import HelpMenu from "@/components/HelpMenu";
import { CATEGORIES, REGIONS, VERTICALS, CSI_DIVISIONS, type Solution } from "@shared/solutions";
import { mockSolutions, mockProjects } from "@shared/mockData";
import { aiSearchSolutions } from "@/utils/aiSearch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Filters {
  verticals: string[];
  categories: string[];
  regions: string[];
  teamSizes: string[];
}

interface SolutionWithScore extends Solution {
  relevanceScore: number;
}

interface CSIDivisionGroup {
  divisionId: string;
  divisionLabel: string;
  solutions: SolutionWithScore[];
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
  const { selectedIds, isSelected, toggleSolution } = useSelectedSolutions();
  
  const [filters, setFilters] = useState<Filters>({
    verticals: [],
    categories: [],
    regions: [],
    teamSizes: [],
  });
  
  const [aiQuery, setAiQuery] = useState<string | null>(null);
  const [collapsedDivisions, setCollapsedDivisions] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);

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
      setAiQuery(queryParam);
    } else {
      setAiQuery(null);
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

  const toggleDivision = (divisionId: string) => {
    setCollapsedDivisions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(divisionId)) {
        newSet.delete(divisionId);
      } else {
        newSet.add(divisionId);
      }
      return newSet;
    });
  };

  const baseSolutions = aiQuery 
    ? aiSearchSolutions(aiQuery, mockSolutions)
    : mockSolutions;

  const filteredSolutions = baseSolutions.filter(solution => {
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
        const parseRange = (range: string): { min: number; max: number | null } => {
          if (range.includes("+")) {
            const min = parseInt(range.replace("+", ""));
            return { min, max: null };
          }
          const parts = range.split("-").map(p => parseInt(p));
          return { min: parts[0], max: parts[1] };
        };
        
        const filterRange = parseRange(ts);
        const solutionRange = parseRange(teamSize);
        
        if (filterRange.max === null) {
          return solutionRange.min >= filterRange.min;
        }
        
        return (
          (solutionRange.min >= filterRange.min && solutionRange.min <= filterRange.max) ||
          (solutionRange.max !== null && solutionRange.max >= filterRange.min && solutionRange.max <= filterRange.max) ||
          (solutionRange.min <= filterRange.min && (solutionRange.max === null || solutionRange.max >= filterRange.max))
        );
      });
      if (!hasTeamSize) return false;
    }

    return true;
  });

  const csiGroups = useMemo(() => {
    const solutionsWithScores: SolutionWithScore[] = filteredSolutions.map(solution => ({
      ...solution,
      relevanceScore: solution.baseScore,
    }));

    const groups: CSIDivisionGroup[] = CSI_DIVISIONS
      .map(division => {
        const primarySolutions = solutionsWithScores
          .filter(s => s.primaryDivision === division.id)
          .sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        const secondarySolutions = solutionsWithScores
          .filter(s => s.primaryDivision !== division.id && s.secondaryDivisions?.includes(division.id))
          .sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        const allSolutions = [...primarySolutions, ...secondarySolutions];
        
        return {
          divisionId: division.id,
          divisionLabel: `Division ${division.code} - ${division.label}`,
          solutions: allSolutions,
        };
      })
      .filter(group => group.solutions.length > 0);

    return groups;
  }, [filteredSolutions]);

  const totalSolutions = filteredSolutions.length;

  const activeFilterCount = 
    filters.verticals.length + 
    filters.categories.length + 
    filters.regions.length + 
    filters.teamSizes.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                <h1 className="font-display text-xl font-bold">Solutions</h1>
                <p className="text-xs text-muted-foreground">
                  {totalSolutions} {totalSolutions === 1 ? 'solution' : 'solutions'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => setLocation("/checkout")}
                  data-testid="button-view-selections"
                >
                  View Selections ({selectedIds.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide' : 'Show'} Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              <HelpMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4">
        <div className="flex gap-4">
          {showFilters && (
            <aside className="w-56 flex-shrink-0">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-sm font-bold">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-7 text-xs"
                      data-testid="button-clear-filters"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto text-sm font-semibold hover:no-underline"
                        data-testid="button-toggle-verticals"
                      >
                        Vertical Market
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2">
                      {VERTICALS.map(vertical => (
                        <div key={vertical} className="flex items-center space-x-2">
                          <Checkbox
                            id={`vertical-${vertical}`}
                            checked={filters.verticals.includes(vertical)}
                            onCheckedChange={() => toggleFilter("verticals", vertical)}
                            data-testid={`checkbox-vertical-${vertical.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={`vertical-${vertical}`} className="cursor-pointer text-sm">
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
                        className="w-full justify-between p-0 h-auto text-sm font-semibold hover:no-underline"
                        data-testid="button-toggle-categories"
                      >
                        Category
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2">
                      {CATEGORIES.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() => toggleFilter("categories", category)}
                            data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={`category-${category}`} className="cursor-pointer text-sm">
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
                        className="w-full justify-between p-0 h-auto text-sm font-semibold hover:no-underline"
                        data-testid="button-toggle-regions"
                      >
                        Region
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2">
                      {REGIONS.map(region => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region}`}
                            checked={filters.regions.includes(region)}
                            onCheckedChange={() => toggleFilter("regions", region)}
                            data-testid={`checkbox-region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                          />
                          <Label htmlFor={`region-${region}`} className="cursor-pointer text-sm">
                            {region}
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
                        className="w-full justify-between p-0 h-auto text-sm font-semibold hover:no-underline"
                        data-testid="button-toggle-teamsize"
                      >
                        Team Size
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2">
                      {TEAM_SIZES.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox
                            id={`teamsize-${size}`}
                            checked={filters.teamSizes.includes(size)}
                            onCheckedChange={() => toggleFilter("teamSizes", size)}
                            data-testid={`checkbox-teamsize-${size.toLowerCase().replace(/\+/g, 'plus').replace(/-/g, '-')}`}
                          />
                          <Label htmlFor={`teamsize-${size}`} className="cursor-pointer text-sm">
                            {size} employees
                          </Label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              {csiGroups.map(group => {
                const isCollapsed = collapsedDivisions.has(group.divisionId);

                return (
                  <Card key={group.divisionId} data-testid={`division-${group.divisionId}`}>
                    <CardHeader className="pb-3 pt-3">
                      <button
                        onClick={() => toggleDivision(group.divisionId)}
                        className="flex items-center justify-between w-full text-left hover-elevate active-elevate-2 rounded-md p-2 -m-2"
                        aria-expanded={!isCollapsed}
                        data-testid={`button-toggle-division-${group.divisionId}`}
                      >
                        <div className="flex items-center gap-2">
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <h3 className="font-display text-base font-semibold">{group.divisionLabel}</h3>
                          <Badge variant="secondary" className="text-xs" data-testid={`badge-division-count-${group.divisionId}`}>
                            {group.solutions.length}
                          </Badge>
                        </div>
                      </button>
                    </CardHeader>

                    {!isCollapsed && (
                      <CardContent className="pt-0 pb-3">
                        <ScrollArea className="w-full">
                          <div className="flex gap-3 pb-2">
                            {group.solutions.map(solution => (
                              <div key={solution.id} className="flex-shrink-0" style={{ width: '280px' }}>
                                <SolutionCard 
                                  solution={solution} 
                                  isSelected={isSelected(solution.id)}
                                  onToggleSelect={toggleSolution}
                                />
                              </div>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </CardContent>
                    )}
                  </Card>
                );
              })}

              {csiGroups.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No solutions found matching your filters.</p>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={clearFilters}
                        data-testid="button-clear-filters-empty"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SolutionCard({ 
  solution, 
  isSelected, 
  onToggleSelect 
}: { 
  solution: SolutionWithScore;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const [, setLocation] = useLocation();
  const [logoError, setLogoError] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    setLocation(`/solution/${solution.id}`);
  };

  const logoUrl = `https://logo.clearbit.com/${solution.website}`;

  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer h-full"
      onClick={handleCardClick}
      data-testid={`card-solution-${solution.id}`}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div 
              className="pt-1" 
              data-checkbox
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(solution.id)}
                data-testid={`checkbox-select-${solution.id}`}
              />
            </div>
            <div
              className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold bg-primary/10 text-primary flex-shrink-0 overflow-hidden"
              data-testid={`logo-${solution.id}`}
            >
              {!logoError ? (
                <img
                  src={logoUrl}
                  alt={`${solution.name} logo`}
                  className="w-full h-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span>{solution.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1 truncate" data-testid={`text-solution-name-${solution.id}`}>
                {solution.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2" data-testid={`text-solution-tagline-${solution.id}`}>
                {solution.tagline}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {solution.categories.slice(0, 2).map(category => (
                  <Badge key={category} variant="secondary" className="text-xs px-1.5 py-0">
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="truncate" data-testid={`text-location-${solution.id}`}>{solution.location}</span>
                <span className="truncate" data-testid={`text-teamsize-${solution.id}`}>{solution.teamSize}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
