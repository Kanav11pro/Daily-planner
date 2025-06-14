
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme, type Theme, getThemeColors } from "@/contexts/ThemeContext";

const themeOptions: { value: Theme; name: string; emoji: string }[] = [
  { value: 'ocean', name: 'Ocean', emoji: '🌊' },
  { value: 'cosmic', name: 'Cosmic', emoji: '🌌' },
  { value: 'aurora', name: 'Aurora', emoji: '✨' },
  { value: 'neon', name: 'Neon', emoji: '⚡' },
  { value: 'sunset', name: 'Sunset', emoji: '🌅' },
  { value: 'emerald', name: 'Emerald', emoji: '💎' }
];

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="grid grid-cols-2 gap-3">
          {themeOptions.map((option) => {
            const colors = getThemeColors(option.value);
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                  theme === option.value
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{option.emoji}</span>
                  {theme === option.value && (
                    <Check className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="text-sm font-bold text-gray-800 mb-2">{option.name}</div>
                <div className={`h-3 rounded-full bg-gradient-to-r ${colors.primary} shadow-sm`} />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
