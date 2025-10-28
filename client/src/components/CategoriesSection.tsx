import { Card } from "@/components/ui/card";
import { Wrench, Shield, Cpu, Leaf, TrendingUp } from "lucide-react";
import { CATEGORIES } from "@shared/solutions";

interface CategoriesSectionProps {
  onCategoryClick?: (category: string) => void;
}

export default function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  const categoryIcons = {
    Robotics: Wrench,
    Safety: Shield,
    AI: Cpu,
    Sustainability: Leaf,
    Productivity: TrendingUp,
  };

  //todo: remove mock functionality
  const categoryCounts = {
    Robotics: 124,
    Safety: 89,
    AI: 156,
    Sustainability: 67,
    Productivity: 143,
  };

  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Explore by Category
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse innovations across key construction technology sectors
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = categoryIcons[category];
            const count = categoryCounts[category];
            
            return (
              <Card
                key={category}
                className="p-6 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md overflow-visible hover-elevate active-elevate-2"
                onClick={() => onCategoryClick?.(category)}
                data-testid={`category-card-${category.toLowerCase()}`}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{category}</h3>
                <p className="text-sm text-muted-foreground">{count} solutions</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
