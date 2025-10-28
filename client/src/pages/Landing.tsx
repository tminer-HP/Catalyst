import { useLocation } from "wouter";
import NavHeader from "@/components/NavHeader";
import HeroSection from "@/components/HeroSection";
import SolutionCard from "@/components/SolutionCard";
import HowItWorks from "@/components/HowItWorks";
import CategoriesSection from "@/components/CategoriesSection";
import CTASection from "@/components/CTASection";
import { mockSolutions } from "@shared/mockData";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleExplore = () => {
    setLocation("/dashboard");
  };

  const handleCategoryClick = (category: string) => {
    setLocation(`/dashboard?category=${category}`);
  };

  const handleSolutionClick = (id: string) => {
    setLocation(`/solution/${id}`);
  };

  return (
    <div className="min-h-screen">
      <NavHeader />
      
      <HeroSection
        onExplore={handleExplore}
        onSearch={handleExplore}
      />

      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured Solutions
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover leading innovations transforming the construction industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockSolutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                onClick={() => handleSolutionClick(solution.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <CategoriesSection onCategoryClick={handleCategoryClick} />

      <CTASection onGetStarted={handleExplore} />

      <footer className="py-12 px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Diverge Connect. The Innovation Discovery Engine.</p>
        </div>
      </footer>
    </div>
  );
}
