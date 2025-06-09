
import { Calendar, Plus, Target, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface HeaderProps {
  onAddTask: () => void;
  onOpenSettings?: () => void;
}

export const Header = ({
  onAddTask,
  onOpenSettings
}: HeaderProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  
  return (
    <header className={`${themeColors.card} backdrop-blur-sm ${themeColors.border} border-b sticky top-0 z-40 ${themeColors.glow} shadow-lg`}>
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className={`bg-gradient-to-r ${themeColors.primary} p-2 sm:p-3 rounded-xl shadow-lg ${themeColors.glow}`}>
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent truncate`}>ExamAce</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium hidden sm:block">Your JEE Success Journey Starts Here</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <ThemeSelector />
            
            {onOpenSettings && (
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenSettings}
                className="hidden sm:flex"
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={onAddTask}
              className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white shadow-lg ${themeColors.glow} transition-all duration-200 hover:scale-105`}
            >
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
