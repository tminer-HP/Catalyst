import HeroSection from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <HeroSection
      onExplore={() => console.log("Explore clicked")}
      onSearch={() => console.log("Search clicked")}
    />
  );
}
