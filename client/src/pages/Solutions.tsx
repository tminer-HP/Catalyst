import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, SlidersHorizontal, X, ChevronDown, ChevronRight } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  
  const [filters, setFilters] = useState<Filters>({
    verticals: [],
    categories: [],
    regions: [],
    teamSizes: [],
  });
  
  const [aiQuery, setAiQuery] = useState<string | null>(null);
  const [collapsedDivisions, setCollapsedDivisions] = useState<Set<string>>(new Set());

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

    const groupsMap = new Map<string, SolutionWithScore[]>();

    solutionsWithScores.forEach(solution => {
      if (!groupsMap.has(solution.primaryDivision)) {
        groupsMap.set(solution.primaryDivision, []);
      }
      groupsMap.get(solution.primaryDivision)!.push(solution);

      if (solution.secondaryDivisions) {
        solution.secondaryDivisions.forEach(divId => {
          if (!groupsMap.has(divId)) {
            groupsMap.set(divId, []);
          }
          groupsMap.get(divId)!.push(solution);
        });
      }
    });

    const groups: CSIDivisionGroup[] = CSI_DIVISIONS
      .map(division => {
        const solutions = groupsMap.get(division.id) || [];
        const sortedSolutions = solutions.sort((a, b) => b.relevanceScore - a.relevanceScore);
        return {
          divisionId: division.id,
          divisionLabel: `Division ${division.code} - ${division.label}`,
          solutions: sortedSolutions,
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
                  {totalSolutions} {totalSolutions === 1 ? 'solution' : 'solutions'} found
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
                      Vertical Market
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3">
                    {VERTICALS.map(vertical => (
                      <div key={vertical} className="flex items-center space-x-2">
                        <Checkbox
                          id={`vertical-${vertical}`}
                          checked={filters.verticals.includes(vertical)}
                          onCheckedChange={() => toggleFilter("verticals", vertical)}
                          data-testid={`checkbox-vertical-${vertical.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label htmlFor={`vertical-${vertical}`} className="cursor-pointer">
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
                      Category
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3">
                    {CATEGORIES.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleFilter("categories", category)}
                          data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label htmlFor={`category-${category}`} className="cursor-pointer">
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
                      Region
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3">
                    {REGIONS.map(region => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={`region-${region}`}
                          checked={filters.regions.includes(region)}
                          onCheckedChange={() => toggleFilter("regions", region)}
                          data-testid={`checkbox-region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label htmlFor={`region-${region}`} className="cursor-pointer">
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
                      className="w-full justify-between p-0 h-auto font-semibold hover:no-underline"
                      data-testid="button-toggle-teamsize"
                    >
                      Team Size
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3">
                    {TEAM_SIZES.map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`teamsize-${size}`}
                          checked={filters.teamSizes.includes(size)}
                          onCheckedChange={() => toggleFilter("teamSizes", size)}
                          data-testid={`checkbox-teamsize-${size.toLowerCase().replace(/\+/g, 'plus').replace(/-/g, '-')}`}
                        />
                        <Label htmlFor={`teamsize-${size}`} className="cursor-pointer">
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
            <div className="space-y-6">
              {csiGroups.map(group => {
                const isCollapsed = collapsedDivisions.has(group.divisionId);
                const primarySolutions = group.solutions.slice(0, 2);
                const secondarySolutions = group.solutions.slice(2);

                return (
                  <Card key={group.divisionId} data-testid={`division-${group.divisionId}`}>
                    <CardHeader className="pb-4">
                      <button
                        onClick={() => toggleDivision(group.divisionId)}
                        className="flex items-center justify-between w-full text-left hover-elevate active-elevate-2 rounded-md p-2 -m-2"
                        data-testid={`button-toggle-division-${group.divisionId}`}
                      >
                        <div className="flex items-center gap-3">
                          {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <h3 className="font-display text-lg font-semibold">{group.divisionLabel}</h3>
                          <Badge variant="secondary" data-testid={`badge-division-count-${group.divisionId}`}>
                            {group.solutions.length}
                          </Badge>
                        </div>
                      </button>
                    </CardHeader>

                    {!isCollapsed && (
                      <CardContent className="pt-0">
                        <div className="flex gap-6">
                          {/* Primary Solutions (Left Column) */}
                          <div className="space-y-4 flex-shrink-0" style={{ width: '320px' }}>
                            {primarySolutions.map(solution => (
                              <SolutionCard key={solution.id} solution={solution} isPrimary />
                            ))}
                          </div>

                          {/* Secondary Solutions (Horizontal Scroll) */}
                          {secondarySolutions.length > 0 && (
                            <div className="flex-1 min-w-0">
                              <ScrollArea className="w-full">
                                <div className="flex gap-4 pb-4">
                                  {secondarySolutions.map(solution => (
                                    <div key={solution.id} className="flex-shrink-0" style={{ width: '320px' }}>
                                      <SolutionCard solution={solution} />
                                    </div>
                                  ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                              </ScrollArea>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}

              {csiGroups.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No solutions found matching your filters.</p>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="outline"
                        className="mt-4"
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

function SolutionCard({ solution, isPrimary = false }: { solution: SolutionWithScore; isPrimary?: boolean }) {
  const [, setLocation] = useLocation();

  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer h-full"
      onClick={() => setLocation(`/solution/${solution.id}`)}
      data-testid={`card-solution-${solution.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-md flex items-center justify-center text-xl font-bold bg-primary/10 text-primary flex-shrink-0"
            data-testid={`logo-${solution.id}`}
          >
            {solution.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base mb-1 truncate" data-testid={`text-solution-name-${solution.id}`}>
              {solution.name}
            </h4>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`text-solution-tagline-${solution.id}`}>
              {solution.tagline}
            </p>
            <div className="flex flex-wrap gap-1">
              {solution.categories.slice(0, 3).map(category => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span data-testid={`text-location-${solution.id}`}>{solution.location}</span>
              <span data-testid={`text-teamsize-${solution.id}`}>{solution.teamSize} team</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
