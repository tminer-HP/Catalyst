import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Search, Building, MapPin, DollarSign } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockProjects, mockSolutions } from "@shared/mockData";

export default function ProjectExplorer() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { addToHistory } = useSearchHistory();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const projectParam = searchParams.get("p");
    if (projectParam && mockProjects.find(p => p.id === projectParam)) {
      setSelectedProject(projectParam);
    } else {
      setSelectedProject(null);
    }
  }, [search]);

  useEffect(() => {
    if (selectedProject) {
      const project = mockProjects.find(p => p.id === selectedProject);
      if (project) {
        addToHistory({
          type: 'project',
          title: project.name,
          path: `/project-explorer?p=${selectedProject}`,
        });
      }
    }
  }, [selectedProject]);

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.vertical.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProjectData = selectedProject
    ? mockProjects.find(p => p.id === selectedProject)
    : null;

  const projectSolutions = selectedProjectData
    ? mockSolutions.filter(s => selectedProjectData.solutionIds.includes(s.id))
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
                <h1 className="font-display text-2xl font-bold">Project Explorer</h1>
                <p className="text-sm text-muted-foreground">Browse solutions by project</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {!selectedProject ? (
          <div>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold mb-4">Active Projects</h2>
              <div className="max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by project name, code, or vertical..."
                    className="pl-10 h-12"
                    data-testid="input-project-search"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map(project => (
                <Card
                  key={project.id}
                  className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                  onClick={() => setLocation(`/project-explorer?p=${project.id}`)}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-xl font-bold">{project.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{project.code}</p>
                    </div>
                    <Badge>{project.status}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{project.value}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{project.vertical}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {project.solutionIds.length} solutions in use
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No projects found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/project-explorer")}
              className="mb-6"
              data-testid="button-back-to-projects"
            >
              ← Back to all projects
            </Button>

            {selectedProjectData && (
              <div className="space-y-8">
                <Card className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-display text-3xl font-bold mb-2">
                        {selectedProjectData.name}
                      </h2>
                      <p className="text-muted-foreground font-mono">{selectedProjectData.code}</p>
                    </div>
                    <Badge className="text-sm">{selectedProjectData.status}</Badge>
                  </div>

                  <p className="text-lg mb-6">{selectedProjectData.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-semibold">{selectedProjectData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Project Value</p>
                      <p className="font-semibold">{selectedProjectData.value}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vertical</p>
                      <p className="font-semibold">{selectedProjectData.vertical}</p>
                    </div>
                  </div>
                </Card>

                <div>
                  <h3 className="font-display text-2xl font-bold mb-6">
                    Solutions Used ({projectSolutions.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectSolutions.map(solution => (
                      <Card
                        key={solution.id}
                        className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
                        onClick={() => setLocation(`/solution/${solution.id}`)}
                        data-testid={`card-solution-${solution.id}`}
                      >
                        <h4 className="font-semibold text-lg mb-2">{solution.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {solution.tagline}
                        </p>
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
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
