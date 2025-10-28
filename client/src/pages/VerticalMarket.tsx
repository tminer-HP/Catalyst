import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Building2, Factory, Plane, Heart, ShoppingBag } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VERTICALS } from "@shared/solutions";
import { mockSolutions, mockProjects } from "@shared/mockData";

const verticalIcons: Record<string, any> = {
  "Datacenter": Building2,
  "Hospital": Heart,
  "Airport": Plane,
  "Commercial": ShoppingBag,
  "Industrial": Factory,
};

export default function VerticalMarket() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const { addToHistory } = useSearchHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const verticalParam = searchParams.get("v");
    if (verticalParam && VERTICALS.includes(verticalParam)) {
      setSelectedVertical(verticalParam);
    } else {
      setSelectedVertical(null);
    }
  }, [search]);

  useEffect(() => {
    if (selectedVertical) {
      addToHistory({
        type: 'vertical',
        title: `${selectedVertical} Solutions`,
        path: `/vertical-market?v=${selectedVertical}`,
      });
    }
  }, [selectedVertical]);

  const verticalStats = VERTICALS.map(vertical => {
    const solutionCount = mockSolutions.filter(s => 
      s.verticals.includes(vertical)
    ).length;
    const projectCount = mockProjects.filter(p => 
      p.vertical === vertical
    ).length;
    return { vertical, solutionCount, projectCount };
  });

  const filteredSolutions = selectedVertical
    ? mockSolutions.filter(s => s.verticals.includes(selectedVertical))
    : [];

  const filteredProjects = selectedVertical
    ? mockProjects.filter(p => p.vertical === selectedVertical)
    : [];

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
                <h1 className="font-display text-2xl font-bold">Select Vertical Market</h1>
                <p className="text-sm text-muted-foreground">Browse solutions by industry vertical</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {!selectedVertical ? (
          <div>
            <div className="mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">Industry Verticals</h2>
              <p className="text-muted-foreground text-lg">
                Select a vertical market to see relevant solutions and projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verticalStats.map(({ vertical, solutionCount, projectCount }) => {
                const Icon = verticalIcons[vertical] || Building2;
                return (
                  <Card
                    key={vertical}
                    className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                    onClick={() => setLocation(`/solutions?v=${vertical}`)}
                    data-testid={`card-vertical-${vertical.toLowerCase()}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold mb-2">{vertical}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{solutionCount} solutions</span>
                          <span>•</span>
                          <span>{projectCount} projects</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/vertical-market")}
                  className="mb-4"
                  data-testid="button-back-to-verticals"
                >
                  ← Back to all verticals
                </Button>
                <h2 className="font-display text-3xl font-bold">{selectedVertical}</h2>
                <p className="text-muted-foreground mt-2">
                  {filteredSolutions.length} solutions and {filteredProjects.length} projects
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <section>
                <h3 className="font-display text-2xl font-bold mb-6">Active Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map(project => (
                    <Card key={project.id} className="p-6" data-testid={`card-project-${project.id}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.code}</p>
                        </div>
                        <Badge>{project.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{project.location}</span>
                        <span className="font-semibold">{project.value}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground mb-2">
                          Using {project.solutionIds.length} solutions
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-display text-2xl font-bold mb-6">Available Solutions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSolutions.map(solution => (
                    <Card
                      key={solution.id}
                      className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                      onClick={() => setLocation(`/solution/${solution.id}`)}
                      data-testid={`card-solution-${solution.id}`}
                    >
                      <div className="mb-4">
                        <h4 className="font-semibold text-lg mb-2">{solution.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {solution.tagline}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {solution.categories.slice(0, 3).map((cat, idx) => (
                          <Badge key={idx} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
