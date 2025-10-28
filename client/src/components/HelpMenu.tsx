import { CircleHelp, Youtube, BookOpen, MessageCircle, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function HelpMenu() {
  const handleYoutubeTutorial = () => {
    window.open("https://www.youtube.com", "_blank");
  };

  const handleUserGuide = () => {
    window.open("/user-guide", "_blank");
  };

  const handleAIChatbot = () => {
    // This could open a chat widget or navigate to a chat page
    console.log("Opening AI chatbot...");
    // Future: Integrate with a chat service
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@catalyst.com";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          data-testid="button-help-menu"
          aria-label="Help menu"
        >
          <CircleHelp className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleYoutubeTutorial}
          data-testid="menu-item-youtube"
        >
          <Youtube className="w-4 h-4 mr-2" />
          YouTube Tutorial
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleUserGuide}
          data-testid="menu-item-user-guide"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          User Guide
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleAIChatbot}
          data-testid="menu-item-ai-chatbot"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          AI Chatbot Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleContactSupport}
          data-testid="menu-item-contact-support"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact Support
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
