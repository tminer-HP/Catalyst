import { Search, GitCompare, Link2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search",
      description: "Explore our comprehensive index of construction technology solutions across categories like robotics, AI, safety, and sustainability.",
    },
    {
      icon: GitCompare,
      title: "Compare",
      description: "Evaluate solutions side-by-side with detailed features, use cases, and company information to find the perfect fit for your project.",
    },
    {
      icon: Link2,
      title: "Connect",
      description: "Reach out directly to solution providers and start integrating cutting-edge innovation into your construction projects.",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and connect with the innovations shaping the future of construction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary/10 mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
