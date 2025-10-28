import { useState } from "react";
import { useLocation } from "wouter";
import { Building2, FolderKanban, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [aiPrompt, setAiPrompt] = useState("");

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      setLocation(`/ai-explore?q=${encodeURIComponent(aiPrompt)}`);
    }
  };

  const discoveryPaths = [
    {
      id: "vertical",
      title: "Select Vertical Market",
      description: "Browse solutions by industry verticals like datacenters, hospitals, airports, and more",
      icon: Building2,
      path: "/vertical-market",
      examples: ["Datacenters", "Hospitals", "Airports", "Commercial"],
      color: "from-blue-500/10 to-cyan-500/10",
      testId: "card-vertical-market"
    },
    {
      id: "project",
      title: "Select Project",
      description: "View applications and innovations being used on specific projects by name or code",
      icon: FolderKanban,
      path: "/project-explorer",
      examples: ["Project Alpha", "DC-2024-01", "Airport Expansion", "Hospital Wing B"],
      color: "from-purple-500/10 to-pink-500/10",
      testId: "card-project"
    },
    {
      id: "innovations",
      title: "Explore Innovations",
      description: "Discover cutting-edge solutions by categories such as robotics, security, estimating, and AI",
      icon: Lightbulb,
      path: "/innovation-explorer",
      examples: ["Robotics", "Security", "Estimating", "AI & ML"],
      color: "from-orange-500/10 to-yellow-500/10",
      testId: "card-innovations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Diverge Connect</h1>
              <p className="text-sm text-muted-foreground">The Innovation Discovery Engine</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Explore
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose your path to discover construction innovations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {discoveryPaths.map((path) => {
            const Icon = path.icon;
            return (
              <button
                key={path.id}
                onClick={() => setLocation(path.path)}
                className={`
                  group relative overflow-hidden rounded-2xl border-2 p-8 text-left
                  transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]
                  bg-gradient-to-br ${path.color} hover:border-primary/50
                `}
                data-testid={path.testId}
              >
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold mb-3">
                    {path.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Examples:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {path.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-background/50 border"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                    Explore →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">AI-Powered Discovery</h3>
                <p className="text-sm text-muted-foreground">
                  Ask anything and get a custom interface tailored to your needs
                </p>
              </div>
            </div>

            <form onSubmit={handlePromptSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Show me layout robotics for datacenter projects..."
                  className="h-14 text-base pr-32"
                  data-testid="input-ai-prompt"
                />
                <Button
                  type="submit"
                  disabled={!aiPrompt.trim()}
                  className="absolute right-2 top-2 h-10"
                  data-testid="button-submit-prompt"
                >
                  Generate View
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Try:</span>
                {[
                  "Layout robotics for hospitals",
                  "Security solutions in North America",
                  "AI estimating tools"
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAiPrompt(suggestion)}
                    className="text-xs px-3 py-1 rounded-full bg-background/50 border hover:bg-background hover:border-primary/50 transition-colors"
                    data-testid={`button-suggestion-${idx}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-12 px-8 py-4 rounded-full bg-muted/30">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Solutions</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Diverge Connect. The Innovation Discovery Engine.</p>
        </div>
      </footer>
    </div>
  );
}
