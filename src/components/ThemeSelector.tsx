
import { Palette, Check, MoonStar, Star, Sunset, Aurora, Sparkles, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme, type Theme, getThemeColors } from "@/contexts/ThemeContext";

const themeOptions: { value: Theme; name: string; emoji: React.ReactNode }[] = [
  { value: "ocean", name: "Ocean", emoji: "🌊" },
  { value: "cosmic", name: "Cosmic", emoji: <Star className="inline h-4 w-4 text-purple-400" /> },
  { value: "aurora", name: "Aurora", emoji: <Aurora className="inline h-4 w-4 text-green-400" /> },
  { value: "sunset", name: "Sunset", emoji: <Sunset className="inline h-4 w-4 text-orange-400" /> },
  { value: "emerald", name: "Emerald", emoji: <CloudSun className="inline h-4 w-4 text-emerald-400" /> },
  { value: "neon", name: "Neon", emoji: <Sparkles className="inline h-4 w-4 text-fuchsia-400" /> },
  { value: "dark", name: "Dark", emoji: <MoonStar className="inline h-4 w-4 text-yellow-300" /> }
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
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-2 gap-2">
          {themeOptions.map((option) => {
            const colors = getThemeColors(option.value);
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-3 rounded-lg border-2 font-medium transition-all duration-200 text-left ${
                  theme === option.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                aria-pressed={theme === option.value}
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{option.emoji}</span>
                  {theme === option.value && (
                    <Check className="h-4 w-4 text-indigo-600" />
                  )}
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {option.name}
                </div>
                <div
                  className={`h-2 rounded-full mt-2 bg-gradient-to-r ${colors.primary}`}
                />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
