import { Calendar, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
interface HeaderProps {
  onAddTask: () => void;
}
export const Header = ({
  onAddTask
}: HeaderProps) => {
  const {
    theme
  } = useTheme();
  const themeColors = getThemeColors(theme);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return <header className={`${themeColors.card}/80 backdrop-blur-sm ${themeColors.border} border-b sticky top-0 z-40`}>
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className={`bg-gradient-to-r ${themeColors.primary} p-2 sm:p-3 rounded-xl shadow-lg`}>
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent truncate`}>
                ExamAce Planner
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium hidden sm:block">Your JEE Success Journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            
            
            <ThemeSelector />
            
            <Button onClick={onAddTask} className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`} size="sm">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>
      </div>
    </header>;
};