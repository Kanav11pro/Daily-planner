
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme, type Theme, getThemeColors } from "@/contexts/ThemeContext";

const themeOptions: { value: Theme; name: string; emoji: string }[] = [
  { value: 'ocean', name: 'Ocean', emoji: '🌊' },
  { value: 'forest', name: 'Forest', emoji: '🌲' },
  { value: 'aurora', name: 'Aurora', emoji: '🌌' },
  { value: 'cosmic', name: 'Cosmic', emoji: '🚀' },
  { value: 'cyber', name: 'Cyber', emoji: '🤖' },
  { value: 'neon', name: 'Neon', emoji: '💎' }
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
      <PopoverContent className="w-60 p-3">
        <div className="grid grid-cols-2 gap-2">
          {themeOptions.map((option) => {
            const colors = getThemeColors(option.value);
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                  theme === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{option.emoji}</span>
                  {theme === option.value && (
                    <Check className="h-4 w-4 text-indigo-600" />
                  )}
                </div>
                <div className="text-sm font-medium text-gray-800">{option.name}</div>
                <div className={`h-2 rounded-full mt-2 bg-gradient-to-r ${colors.primary}`} />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
