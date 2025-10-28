import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
