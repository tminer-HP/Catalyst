import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, REGIONS, VERTICALS } from "@shared/solutions";

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
  selectedVerticals: string[];
  onToggleVertical: (vertical: string) => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onToggleCategory,
  selectedRegions,
  onToggleRegion,
  selectedVerticals,
  onToggleVertical,
  onClearAll,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedRegions.length > 0 ||
    selectedVerticals.length > 0 ||
    searchQuery !== "";

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="font-display text-xl font-bold mb-4">Filter Solutions</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ask AI to find solutions..."
            className="pl-9 pr-9"
            data-testid="input-ai-search"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="w-full"
            data-testid="button-clear-all-filters"
          >
            Clear all filters
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Category
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => onToggleCategory(category)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                    data-testid={`filter-category-${category.toLowerCase()}`}
                  >
                    {category}
                    {isSelected && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        ✓
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Region
            </h3>
            <div className="space-y-2">
              {REGIONS.map((region) => {
                const isSelected = selectedRegions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => onToggleRegion(region)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                    data-testid={`filter-region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {region}
                    {isSelected && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        ✓
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Vertical
            </h3>
            <div className="space-y-2">
              {VERTICALS.map((vertical) => {
                const isSelected = selectedVerticals.includes(vertical);
                return (
                  <button
                    key={vertical}
                    onClick={() => onToggleVertical(vertical)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                    data-testid={`filter-vertical-${vertical.toLowerCase()}`}
                  >
                    {vertical}
                    {isSelected && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        ✓
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
