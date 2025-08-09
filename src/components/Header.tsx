
import { Calendar, Plus, Target, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  onAddTask: () => void;
}

export const Header = ({ onAddTask }: HeaderProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnPracticeAnalytics = location.pathname === '/practice-analytics';

  return (
    <header className={`${themeColors.card} backdrop-blur-sm ${themeColors.border} border-b sticky top-0 z-40 ${themeColors.glow} shadow-lg`}>
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            {isOnPracticeAnalytics && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Planner</span>
                <span className="sm:hidden">Back</span>
              </Button>
            )}
            <div className={`bg-gradient-to-r ${themeColors.primary} p-2 sm:p-3 rounded-xl shadow-lg ${themeColors.glow} transition-all duration-300 hover:scale-105`}>
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent truncate`}>
                ExamAce
              </h1>
              <p className={`text-sm sm:text-base ${theme === 'midnight' || theme === 'obsidian' ? 'text-gray-300' : 'text-gray-600'} font-medium hidden sm:block`}>
                Your JEE Success Journey Starts Here
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {!isOnPracticeAnalytics && (
              <Button variant="outline" size="sm" asChild>
                <a href="/practice-analytics" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden md:inline">Practice Analytics</span>
                  <span className="md:hidden">Analytics</span>
                </a>
              </Button>
            )}
            <ThemeSelector />
          </div>
        </div>
      </div>
    </header>
  );
};
