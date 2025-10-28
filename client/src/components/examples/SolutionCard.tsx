import SolutionCard from "../SolutionCard";
import { mockSolutions } from "@shared/mockData";

export default function SolutionCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <SolutionCard
          solution={mockSolutions[0]}
          onClick={() => console.log("Card clicked")}
        />
      </div>
    </div>
  );
}
