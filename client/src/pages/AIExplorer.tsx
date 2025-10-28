import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { aiSearchSolutions } from "@/utils/aiSearch";
import { mockSolutions } from "@shared/mockData";

export default function AIExplorer() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [displayQuery, setDisplayQuery] = useState(initialQuery);
  const [results, setResults] = useState(
    initialQuery ? aiSearchSolutions(initialQuery, mockSolutions) : []
  );
  const { addToHistory } = useSearchHistory();

  useEffect(() => {
    if (initialQuery) {
      setResults(aiSearchSolutions(initialQuery, mockSolutions));
      addToHistory({
        type: 'ai',
        title: initialQuery,
        path: `/ai-explore?q=${encodeURIComponent(initialQuery)}`,
      });
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setDisplayQuery(query);
      setResults(aiSearchSolutions(query, mockSolutions));
    }
  };

  const handleNewPrompt = () => {
    setQuery("");
    setDisplayQuery("");
    setResults([]);
  };

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
                <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  AI-Powered Discovery
                </h1>
                <p className="text-sm text-muted-foreground">Natural language solution search</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="font-display text-2xl font-bold">Ask Anything</h2>
                  <p className="text-sm text-muted-foreground">
                    Describe what you're looking for in natural language
                  </p>
                </div>
              </div>

              <div className="relative">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Show me layout robotics for datacenter projects..."
                  className="h-14 text-base pr-32"
                  data-testid="input-ai-query"
                />
                <Button
                  type="submit"
                  disabled={!query.trim()}
                  className="absolute right-2 top-2 h-10"
                  data-testid="button-search"
                >
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Try:</span>
                {[
                  "Layout robotics for hospitals",
                  "Safety monitoring in North America",
                  "Estimating tools for datacenters",
                  "Productivity solutions for commercial projects"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      setDisplayQuery(suggestion);
                      setResults(aiSearchSolutions(suggestion, mockSolutions));
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-background/50 border hover:bg-background hover:border-primary/50 transition-colors"
                    data-testid={`button-suggestion-${idx}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
          </Card>
        </div>

        {displayQuery && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">
                  Results for: "{displayQuery}"
                </h3>
                <p className="text-muted-foreground">
                  Found {results.length} {results.length === 1 ? 'solution' : 'solutions'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleNewPrompt}
                data-testid="button-new-search"
              >
                New Search
              </Button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(solution => (
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

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {solution.categories.slice(0, 3).map((cat, idx) => (
                          <Badge key={idx} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-3 border-t text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{solution.location}</span>
                          <span>{solution.verticals.length} verticals</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  No solutions found for this query. Try a different search.
                </p>
              </Card>
            )}
          </div>
        )}

        {!displayQuery && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Enter a query above to discover solutions with AI
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
