import { useState } from "react";
import { useLocation } from "wouter";
import { Building2, FolderKanban, Lightbulb, Sparkles, ArrowRight } from "lucide-react";
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
      description: "Browse solutions by industry verticals like datacenters, hospitals, airports",
      icon: Building2,
      path: "/vertical-market",
      testId: "card-vertical-market"
    },
    {
      id: "project",
      title: "Select Project",
      description: "View applications and innovations being used on specific projects",
      icon: FolderKanban,
      path: "/project-explorer",
      testId: "card-project"
    },
    {
      id: "innovations",
      title: "Explore Innovations",
      description: "Discover cutting-edge solutions by categories such as robotics, security, estimating",
      icon: Lightbulb,
      path: "/innovation-explorer",
      testId: "card-innovations"
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Diverge Connect</h1>
            <p className="text-sm text-muted-foreground">The Innovation Discovery Engine</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-5xl space-y-16">
          <div className="text-center space-y-6">
            <h2 className="font-display text-6xl font-bold text-foreground">
              Explore
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your path to discover construction innovations
            </p>
          </div>

          <div className="space-y-12">
            <div className="max-w-3xl mx-auto">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-foreground" />
                <h3 className="font-display text-xl font-semibold text-foreground">AI-Powered Discovery</h3>
              </div>
              <form onSubmit={handlePromptSubmit}>
                <div className="relative">
                  <Input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask anything... e.g., Show me layout robotics for datacenter projects"
                    className="h-14 text-base pr-32 border-2"
                    data-testid="input-ai-prompt"
                  />
                  <Button
                    type="submit"
                    disabled={!aiPrompt.trim()}
                    variant="default"
                    className="absolute right-2 top-2 h-10"
                    data-testid="button-submit-prompt"
                  >
                    Generate View
                  </Button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {discoveryPaths.map((path) => {
                const Icon = path.icon;
                return (
                  <button
                    key={path.id}
                    onClick={() => setLocation(path.path)}
                    className="group text-left p-8 border-2 rounded-lg hover-elevate active-elevate-2 transition-all"
                    data-testid={path.testId}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="font-display text-xl font-bold text-foreground flex-1">
                        {path.title}
                      </h3>
                      <Icon className="w-8 h-8 text-foreground flex-shrink-0" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {path.description}
                    </p>

                    <div className="flex items-center text-sm font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Diverge Connect. The Innovation Discovery Engine.</p>
        </div>
      </footer>
    </div>
  );
}
