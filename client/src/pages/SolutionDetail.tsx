import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NavHeader from "@/components/NavHeader";
import { mockSolutions } from "@shared/mockData";

export default function SolutionDetail() {
  const [, params] = useRoute("/solution/:id");
  const [, setLocation] = useLocation();
  
  const solution = mockSolutions.find((s) => s.id === params?.id);

  if (!solution) {
    return (
      <div className="min-h-screen">
        <NavHeader />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Solution not found</h1>
          <Button onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const logoSrc = solution.logo.replace("@assets/", "/attached_assets/");
  const relatedSolutions = mockSolutions.filter((s) =>
    solution.relatedIds.includes(s.id)
  );

  return (
    <div className="min-h-screen">
      <NavHeader />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/dashboard")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center h-24 md:h-32 w-24 md:w-32 flex-shrink-0">
                  <img
                    src={logoSrc}
                    alt={`${solution.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    data-testid="img-solution-logo"
                  />
                </div>
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-2" data-testid="text-solution-name">
                    {solution.name}
                  </h1>
                  <p className="text-lg text-muted-foreground">{solution.tagline}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {solution.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-sm">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {solution.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <div className="space-y-3">
                {solution.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {solution.useCases.map((useCase, index) => (
                  <Card key={index} className="p-4">
                    <p className="text-sm">{useCase}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Company Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{solution.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Founded</p>
                  <p className="font-medium">{solution.founded}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Team Size</p>
                  <p className="font-medium">{solution.teamSize}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Website</p>
                  <a
                    href={`https://${solution.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                    data-testid="link-website"
                  >
                    {solution.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                data-testid="button-connect"
              >
                Connect with {solution.name}
              </Button>
            </Card>
          </div>
        </div>

        {relatedSolutions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Related Technologies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedSolutions.map((related) => {
                const relatedLogoSrc = related.logo.replace("@assets/", "/attached_assets/");
                return (
                  <Card
                    key={related.id}
                    className="p-4 text-center cursor-pointer hover:-translate-y-1 transition-all duration-200 overflow-visible hover-elevate active-elevate-2"
                    onClick={() => setLocation(`/solution/${related.id}`)}
                    data-testid={`card-related-${related.id}`}
                  >
                    <div className="flex items-center justify-center h-12 mb-3">
                      <img
                        src={relatedLogoSrc}
                        alt={`${related.name} logo`}
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium">{related.name}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
