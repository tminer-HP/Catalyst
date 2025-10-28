import { useState } from "react";
import FilterSidebar from "../FilterSidebar";

export default function FilterSidebarExample() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>(["Robotics"]);
  const [regions, setRegions] = useState<string[]>([]);
  const [verticals, setVerticals] = useState<string[]>(["Datacenter"]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRegion = (reg: string) => {
    setRegions((prev) =>
      prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
    );
  };

  const toggleVertical = (vert: string) => {
    setVerticals((prev) =>
      prev.includes(vert) ? prev.filter((v) => v !== vert) : [...prev, vert]
    );
  };

  const clearAll = () => {
    setSearch("");
    setCategories([]);
    setRegions([]);
    setVerticals([]);
  };

  return (
    <div className="h-screen">
      <FilterSidebar
        searchQuery={search}
        onSearchChange={setSearch}
        selectedCategories={categories}
        onToggleCategory={toggleCategory}
        selectedRegions={regions}
        onToggleRegion={toggleRegion}
        selectedVerticals={verticals}
        onToggleVertical={toggleVertical}
        onClearAll={clearAll}
      />
    </div>
  );
}
