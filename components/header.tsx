import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div className="pl-2">
        <p className="text-lg font-medium">Assistant</p>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Toggle sidebar"
              data-testid="sidebar-toggle-button"
              onClick={onClose}
              variant="ghost"
              className="px-2 h-fit"
            >
              <PanelLeft size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="end">Toggle sidebar</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
