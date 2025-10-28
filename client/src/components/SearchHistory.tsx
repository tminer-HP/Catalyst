import { useLocation } from "wouter";
import { Clock, Trash2, Building2, FolderKanban, Lightbulb, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSearchHistory, type HistoryItem } from "@/hooks/useSearchHistory";
import logoUrl from "@assets/image (1)_1761686720998.png";

const typeIcons = {
  vertical: Building2,
  project: FolderKanban,
  innovation: Lightbulb,
  ai: Sparkles,
};

const typeLabels = {
  vertical: "Vertical",
  project: "Project",
  innovation: "Innovation",
  ai: "AI Search",
};

export default function SearchHistory() {
  const [, setLocation] = useLocation();
  const { history, clearHistory } = useSearchHistory();

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div className="flex justify-center mb-3 group-data-[collapsible=icon]:mb-0">
          <img 
            src={logoUrl} 
            alt="Catalyst Logo" 
            className="h-16 group-data-[collapsible=icon]:h-8 transition-all" 
          />
        </div>
        <Button
          variant="outline"
          className="w-full group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
          onClick={() => setLocation("/")}
          data-testid="button-sidebar-new-search"
        >
          <Plus className="w-4 h-4 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5" />
          <span className="group-data-[collapsible=icon]:hidden">New Search</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-3">
            <SidebarGroupLabel className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden">History</span>
            </SidebarGroupLabel>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors group-data-[collapsible=icon]:hidden"
                data-testid="button-clear-history"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          <SidebarGroupContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground px-2 group-data-[collapsible=icon]:py-4">
                <span className="group-data-[collapsible=icon]:hidden">No search history yet</span>
              </div>
            ) : (
              <SidebarMenu>
                {history.map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setLocation(item.path)}
                        data-testid={`history-item-${item.id}`}
                        className="w-full"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {typeLabels[item.type]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
