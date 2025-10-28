import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Solution } from "@shared/solutions";

interface SolutionCardProps {
  solution: Solution;
  onClick?: () => void;
}

export default function SolutionCard({ solution, onClick }: SolutionCardProps) {
  const logoSrc = solution.logo.replace("@assets/", "/attached_assets/");

  return (
    <Card
      className="h-72 flex flex-col p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg overflow-visible hover-elevate active-elevate-2"
      onClick={onClick}
      data-testid={`card-solution-${solution.id}`}
    >
      <div className="flex items-center justify-center h-16 mb-4">
        <img
          src={logoSrc}
          alt={`${solution.name} logo`}
          className="max-h-16 max-w-full object-contain"
          data-testid={`img-logo-${solution.id}`}
        />
      </div>
      
      <h3 className="text-xl font-semibold mb-2" data-testid={`text-name-${solution.id}`}>
        {solution.name}
      </h3>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
        {solution.tagline}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {solution.categories.slice(0, 3).map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="text-xs rounded-full"
            data-testid={`badge-category-${category.toLowerCase()}`}
          >
            {category}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
