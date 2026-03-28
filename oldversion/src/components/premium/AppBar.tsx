import { ArrowLeft, Menu } from "lucide-react";
import { cn } from "../ui/utils";

interface AppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function AppBar({
  title,
  showBack = false,
  onBack,
  showMenu = false,
  onMenu,
  rightAction,
  className
}: AppBarProps) {
  return (
    <header className={cn(
      "flex items-center justify-between px-4 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100",
      "sticky top-0 z-50",
      className
    )}>
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        {showMenu && (
          <button
            onClick={onMenu}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
}