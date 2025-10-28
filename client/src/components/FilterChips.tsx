import { Badge } from "@/components/ui/badge";
import { CATEGORIES, type Category } from "@shared/solutions";

interface FilterChipsProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export default function FilterChips({
  selectedCategories,
  onToggleCategory,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategories.includes(category);
        
        return (
          <Badge
            key={category}
            variant={isSelected ? "default" : "outline"}
            className={`
              rounded-full px-4 py-2 cursor-pointer text-sm font-medium
              transition-all duration-200
              ${isSelected ? "toggle-elevate toggle-elevated" : "hover-elevate active-elevate-2"}
            `}
            onClick={() => onToggleCategory(category)}
            data-testid={`filter-${category.toLowerCase()}`}
          >
            {category}
          </Badge>
        );
      })}
    </div>
  );
}
