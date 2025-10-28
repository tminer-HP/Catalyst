import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Cpu, Shield, Calculator, Wrench, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@shared/solutions";
import { mockSolutions } from "@shared/mockData";

const categoryIcons: Record<string, any> = {
  "Robotics": Cpu,
  "Safety": Shield,
  "Estimating": Calculator,
  "Layout": Wrench,
  "AI": Eye,
  "Productivity": Wrench,
};

export default function InnovationExplorer() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryStats = CATEGORIES.map(category => {
    const count = mockSolutions.filter(s => s.categories.includes(category)).length;
    return { category, count };
  });

  const filteredSolutions = selectedCategory
    ? mockSolutions.filter(s => s.categories.includes(selectedCategory))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-2xl font-bold">Explore Innovations</h1>
                <p className="text-sm text-muted-foreground">Browse by innovation category</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {!selectedCategory ? (
          <div>
            <div className="mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">Innovation Categories</h2>
              <p className="text-muted-foreground text-lg">
                Explore cutting-edge construction technologies by category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryStats.map(({ category, count }) => {
                const Icon = categoryIcons[category] || Cpu;
                return (
                  <Card
                    key={category}
                    className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`card-category-${category.toLowerCase()}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold mb-2">{category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {count} {count === 1 ? 'solution' : 'solutions'}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="mb-4"
                data-testid="button-back-to-categories"
              >
                ← Back to all categories
              </Button>
              <h2 className="font-display text-3xl font-bold">{selectedCategory}</h2>
              <p className="text-muted-foreground mt-2">
                {filteredSolutions.length} {filteredSolutions.length === 1 ? 'solution' : 'solutions'} available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSolutions.map(solution => (
                <Card
                  key={solution.id}
                  className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                  onClick={() => setLocation(`/solution/${solution.id}`)}
                  data-testid={`card-solution-${solution.id}`}
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{solution.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {solution.tagline}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {solution.categories.map((cat, idx) => (
                        <Badge key={idx} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Verticals:</p>
                      <div className="flex flex-wrap gap-1">
                        {solution.verticals.slice(0, 3).map((vertical, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded bg-muted">
                            {vertical}
                          </span>
                        ))}
                        {solution.verticals.length > 3 && (
                          <span className="text-xs px-2 py-1">
                            +{solution.verticals.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {solution.location}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
