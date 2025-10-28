import { useRoute, useLocation } from "wouter";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NavHeader from "@/components/NavHeader";
import HelpMenu from "@/components/HelpMenu";
import { mockSolutions } from "@shared/mockData";
import { useState, useEffect } from "react";

export default function SolutionDetail() {
  const [, params] = useRoute("/solution/:id");
  const [, setLocation] = useLocation();
  const [logoError, setLogoError] = useState(false);
  
  const solution = mockSolutions.find((s) => s.id === params?.id);

  useEffect(() => {
    setLogoError(false);
  }, [params?.id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/solutions");
    }
  };

  if (!solution) {
    return (
      <div className="min-h-screen">
        <NavHeader />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Solution not found</h1>
          <Button onClick={handleBack}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const logoUrl = `https://logo.clearbit.com/${solution.website}`;
  const relatedSolutions = mockSolutions.filter((s) =>
    solution.relatedIds.includes(s.id)
  );

  return (
    <div className="min-h-screen">
      <NavHeader>
        <HelpMenu />
      </NavHeader>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center justify-center h-24 md:h-32 w-24 md:w-32 flex-shrink-0 rounded bg-primary/10 overflow-hidden">
                  {!logoError ? (
                    <img
                      src={logoUrl}
                      alt={`${solution.name} logo`}
                      className="max-h-full max-w-full object-contain p-2"
                      data-testid="img-solution-logo"
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    <div className="text-4xl font-bold text-primary">
                      {solution.name.charAt(0)}
                    </div>
                  )}
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

            {solution.media && (
              <div className="space-y-8">
                {solution.media.images && solution.media.images.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {solution.media.images.map((image, index) => (
                        <Card key={index} className="overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.caption}
                            className="w-full h-64 object-cover"
                            data-testid={`img-gallery-${index}`}
                          />
                          <div className="p-3">
                            <p className="text-sm text-muted-foreground">{image.caption}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {solution.media.videos && solution.media.videos.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {solution.media.videos.map((video, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${video.youtubeId}`}
                              title={video.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              data-testid={`video-${index}`}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">{video.title}</h3>
                            {video.description && (
                              <p className="text-sm text-muted-foreground">{video.description}</p>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {solution.media.caseStudies && solution.media.caseStudies.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Case Studies</h2>
                    <div className="space-y-4">
                      {solution.media.caseStudies.map((caseStudy, index) => (
                        <Card key={index} className="p-6">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <h3 className="font-semibold text-lg">{caseStudy.title}</h3>
                            <Badge variant="secondary">{caseStudy.projectType}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{caseStudy.description}</p>
                          <div className="bg-primary/5 rounded p-4 mb-4">
                            <p className="text-sm font-medium mb-1">Results:</p>
                            <p className="text-sm text-muted-foreground">{caseStudy.results}</p>
                          </div>
                          {caseStudy.pdfUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={caseStudy.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Download PDF
                              </a>
                            </Button>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
              {relatedSolutions.map((related) => (
                <RelatedSolutionCard
                  key={related.id}
                  solution={related}
                  onClick={() => setLocation(`/solution/${related.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedSolutionCard({ 
  solution, 
  onClick 
}: { 
  solution: Solution;
  onClick: () => void;
}) {
  const [logoError, setLogoError] = useState(false);
  const logoUrl = `https://logo.clearbit.com/${solution.website}`;

  return (
    <Card
      className="p-4 text-center cursor-pointer hover:-translate-y-1 transition-all duration-200 overflow-visible hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-related-${solution.id}`}
    >
      <div className="flex items-center justify-center h-12 mb-3 overflow-hidden">
        {!logoError ? (
          <img
            src={logoUrl}
            alt={`${solution.name} logo`}
            className="max-h-12 max-w-full object-contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="h-12 w-12 rounded flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
            {solution.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="text-sm font-medium">{solution.name}</p>
    </Card>
  );
}
