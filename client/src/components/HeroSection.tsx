import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import heroImage from "@assets/generated_images/Modern_construction_technology_hero_image_1737eb25.png";

interface HeroSectionProps {
  onExplore?: () => void;
  onSearch?: () => void;
}

export default function HeroSection({ onExplore, onSearch }: HeroSectionProps) {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative h-full flex items-center justify-center px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Discover. Compare. Connect.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            The global index of construction innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onExplore}
              className="rounded-full px-8 py-6 text-base font-semibold bg-primary text-primary-foreground border border-primary-border hover-elevate active-elevate-2"
              data-testid="button-explore-solutions"
            >
              Explore Solutions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onSearch}
              className="rounded-full px-8 py-6 text-base font-semibold backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-search-innovations"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Innovations
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">500+</span>
              <span>Solutions Indexed</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">50+</span>
              <span>Countries</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <span className="text-white">Trusted by Industry Leaders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
