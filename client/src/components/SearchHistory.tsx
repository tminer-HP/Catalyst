import { useLocation } from "wouter";
import { Clock, Trash2, Building2, FolderKanban, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchHistory, type HistoryItem } from "@/hooks/useSearchHistory";
import logoUrl from "@assets/image_1761678131803.png";

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
    <div className="w-72 border-r bg-background flex flex-col h-screen">
      <div className="p-6 border-b">
        <div className="flex justify-center mb-4">
          <img src={logoUrl} alt="Catalyst Logo" className="h-20" />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setLocation("/")}
          data-testid="button-new-search"
        >
          + New Search
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>History</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-clear-history"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No search history yet
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <button
                    key={item.id}
                    onClick={() => setLocation(item.path)}
                    className="w-full text-left p-3 rounded-md hover-elevate active-elevate-2 transition-all group"
                    data-testid={`history-item-${item.id}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
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
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
