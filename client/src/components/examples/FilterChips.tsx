import { useState } from "react";
import FilterChips from "../FilterChips";

export default function FilterChipsExample() {
  const [selected, setSelected] = useState<string[]>(["Robotics"]);

  const handleToggle = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="p-8 bg-background">
      <FilterChips selectedCategories={selected} onToggleCategory={handleToggle} />
    </div>
  );
}
