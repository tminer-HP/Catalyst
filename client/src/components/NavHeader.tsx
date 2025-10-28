import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ReactNode } from "react";

interface NavHeaderProps {
  showSearch?: boolean;
  children?: ReactNode;
}

export default function NavHeader({ showSearch = false, children }: NavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="font-display font-bold text-xl hidden sm:inline">
                Diverge Connect
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                data-testid="link-dashboard"
              >
                Dashboard
              </Button>
            </Link>
            <Button
              variant="default"
              className="rounded-full"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
