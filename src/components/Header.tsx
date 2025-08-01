
import { Target, Sparkles } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme, getThemeColors } from "@/contexts/ThemeContext";

interface HeaderProps {
  onAddTask: () => void;
}

export const Header = ({ onAddTask }: HeaderProps) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  return (
    <header className={`${themeColors.card} backdrop-blur-sm ${themeColors.border} border-b sticky top-0 z-40 ${themeColors.glow} shadow-lg`}>
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 group">
            {/* Animated Logo Container */}
            <div className={`relative bg-gradient-to-r ${themeColors.primary} p-2 sm:p-3 rounded-xl shadow-lg ${themeColors.glow} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white transition-transform duration-300 group-hover:rotate-12" />
              
              {/* Floating sparkles animation */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="h-2 w-2 text-blue-300 animate-bounce" />
              </div>
            </div>
            
            <div className="min-w-0">
              {/* Animated Title */}
              <div className="flex items-center space-x-2">
                <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent truncate transition-all duration-300 hover:scale-105 cursor-pointer`}>
                  ExamAce
                </h1>
                
                {/* Animated Badge */}
                <div className={`hidden sm:flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${themeColors.primary} text-white shadow-sm animate-pulse`}>
                  <span className="relative">
                    JEE 2027
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  </span>
                </div>
              </div>
              
              {/* Subtitle with typing animation effect */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium hidden sm:block animate-fade-in">
                Your JEE Success Journey Starts Here
                <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Animated Theme Selector */}
            <div className="transform transition-all duration-300 hover:scale-110">
              <ThemeSelector />
            </div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${themeColors.primary} rounded-full animate-pulse`} style={{ width: '75%' }}></div>
        </div>
      </div>
    </header>
  );
};
