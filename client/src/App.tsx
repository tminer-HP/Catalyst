import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import SearchHistory from "@/components/SearchHistory";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import SolutionDetail from "@/pages/SolutionDetail";
import VerticalMarket from "@/pages/VerticalMarket";
import ProjectExplorer from "@/pages/ProjectExplorer";
import InnovationExplorer from "@/pages/InnovationExplorer";
import AIExplorer from "@/pages/AIExplorer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/vertical-market" component={VerticalMarket} />
      <Route path="/project-explorer" component={ProjectExplorer} />
      <Route path="/innovation-explorer" component={InnovationExplorer} />
      <Route path="/ai-explore" component={AIExplorer} />
      <Route path="/solution/:id" component={SolutionDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <SearchHistory />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Router />
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
