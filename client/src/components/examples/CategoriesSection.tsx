import CategoriesSection from "../CategoriesSection";

export default function CategoriesSectionExample() {
  return (
    <CategoriesSection
      onCategoryClick={(category) => console.log("Category clicked:", category)}
    />
  );
}
