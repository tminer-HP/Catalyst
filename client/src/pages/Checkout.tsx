import { useSelectedSolutions } from "@/hooks/useSelectedSolutions";
import { mockSolutions } from "@shared/mockData";
import { CSI_DIVISIONS } from "@shared/solutions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Share2, Printer, Download, Star, Phone, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { selectedIds, toggleSolution, clearSelections } = useSelectedSolutions();

  const selectedSolutions = mockSolutions.filter(s => selectedIds.includes(s.id));

  const groupedByDivision = CSI_DIVISIONS
    .map(division => {
      const primarySolutions = selectedSolutions
        .filter(s => s.primaryDivision === division.id)
        .sort((a, b) => b.baseScore - a.baseScore);
      
      const secondarySolutions = selectedSolutions
        .filter(s => s.primaryDivision !== division.id && s.secondaryDivisions?.includes(division.id))
        .sort((a, b) => b.baseScore - a.baseScore);
      
      return {
        division,
        solutions: [...primarySolutions, ...secondarySolutions],
      };
    })
    .filter(group => group.solutions.length > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const data = selectedSolutions.map(s => ({
      name: s.name,
      division: `Div ${s.primaryDivision}`,
      cost: s.averageCost,
      rating: s.rating,
      projects: s.projectsUsed,
      contact: s.contactName,
      email: s.contactEmail,
      phone: s.contactPhone,
    }));
    
    const csv = [
      ['Name', 'Division', 'Cost', 'Rating', 'Projects', 'Contact', 'Email', 'Phone'],
      ...data.map(d => Object.values(d))
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-solutions.csv';
    a.click();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/checkout?solutions=${selectedIds.join(',')}`;
    if (navigator.share) {
      await navigator.share({
        title: 'Selected Solutions',
        text: `I've selected ${selectedSolutions.length} construction solutions`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/solutions")}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display text-xl font-bold">Selected Solutions</h1>
                <p className="text-xs text-muted-foreground">
                  {selectedSolutions.length} {selectedSolutions.length === 1 ? 'solution' : 'solutions'} selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6">
        {selectedSolutions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No solutions selected yet.</p>
              <Button onClick={() => setLocation("/solutions")} data-testid="button-browse-solutions">
                Browse Solutions
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedByDivision.map(({ division, solutions }) => (
              <div key={division.id} data-testid={`checkout-division-${division.id}`}>
                <div className="mb-3">
                  <h2 className="font-display text-lg font-semibold">
                    Division {division.code} - {division.label}
                  </h2>
                </div>
                <div className="space-y-3">
                  {solutions.map(solution => (
                    <Card key={solution.id} data-testid={`checkout-card-${solution.id}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={true}
                              onCheckedChange={() => toggleSolution(solution.id)}
                              data-testid={`checkbox-solution-${solution.id}`}
                            />
                            <div className="w-16 h-16 rounded flex items-center justify-center text-2xl font-bold bg-primary/10 text-primary flex-shrink-0">
                              {solution.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base mb-1">{solution.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{solution.tagline}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Cost:</span>
                                  <span className="text-muted-foreground">{solution.averageCost}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{solution.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">{solution.projectsUsed} projects</span>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1">
                                {solution.categories.map(cat => (
                                  <Badge key={cat} variant="secondary" className="text-xs">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-64 flex-shrink-0 border-l pl-4">
                            <h4 className="text-sm font-semibold mb-2">Point of Contact</h4>
                            <div className="space-y-2 text-sm">
                              {solution.contactName && (
                                <div>
                                  <p className="font-medium">{solution.contactName}</p>
                                </div>
                              )}
                              {solution.contactPhone && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>{solution.contactPhone}</span>
                                </div>
                              )}
                              {solution.contactEmail && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="w-3.5 h-3.5" />
                                  <a href={`mailto:${solution.contactEmail}`} className="hover:text-foreground">
                                    {solution.contactEmail}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-end gap-2 print:hidden">
              <Button variant="outline" onClick={clearSelections} data-testid="button-clear-all">
                Clear All Selections
              </Button>
              <Button onClick={() => setLocation("/solutions")} data-testid="button-continue-browsing">
                Continue Browsing
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
