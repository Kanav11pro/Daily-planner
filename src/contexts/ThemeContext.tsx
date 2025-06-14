import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme =
  | "ocean"
  | "cosmic"
  | "aurora"
  | "sunset"
  | "emerald"
  | "neon"
  | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme palettes: High contrast, vivid gradients, rich backgrounds.
// "ocean" remains as-is, all others are improved for beauty/contrast.
const themes = {
  ocean: {
    primary: "from-cyan-500 to-blue-600",
    secondary: "from-cyan-50 via-blue-50 to-teal-50",
    background: "from-cyan-100 via-blue-200 to-teal-300",
    accent: "bg-cyan-100 text-cyan-900",
    card: "bg-white/95 backdrop-blur-md border border-cyan-200 text-gray-900",
    border: "border-cyan-300",
    text: "text-cyan-900",
    glow: "shadow-cyan-300/60"
  },

  // Cosmic: deep violet background, bright purple/pink/blue card gradients
  cosmic: {
    primary: "from-[#a471f7] via-[#7b60e1] to-[#37b7fb]", // purple to blue
    secondary: "from-[#191027] via-[#26183a] to-[#17101e]",
    background: "from-[#130d19] via-[#1a1330] to-[#19102a]",
    accent: "bg-gradient-to-r from-[#bb4ff9] to-[#37b7fb] text-white font-bold",
    card: "bg-gradient-to-tr from-[#744bff] via-[#697eff] to-[#37b7fb] text-white shadow-lg shadow-[#9b7bff]/30 border-none",
    border: "border-[#bb4ff9]/30",
    text: "text-white",
    glow: "shadow-[#7b60e1]/40"
  },

  // Aurora: high contrast, vibrant pink/cyan/yellow
  aurora: {
    primary: "from-[#fd5cff] via-[#14ffe9] to-[#58aaff]", // vivid pink to cyan blue
    secondary: "from-[#22151d] via-[#141b25] to-[#1e2539]",
    background: "from-[#161521] via-[#131622] to-[#0e1523]",
    accent: "bg-gradient-to-r from-[#fd5cff] to-[#14ffe9] text-black font-bold",
    card: "bg-gradient-to-tr from-[#fd5cff] via-[#14ffe9] to-[#58aaff] text-white shadow-xl shadow-[#58aaff]/25 border-none",
    border: "border-[#14ffe9]/25",
    text: "text-white",
    glow: "shadow-[#fd5cff]/30"
  },

  // Neon: dark base, bold fuchsia/aqua/blue gradient
  neon: {
    primary: "from-[#ff33bb] via-[#36f3ff] to-[#3a80fe]",
    secondary: "from-[#18082b] via-[#071038] to-[#18062a]",
    background: "from-[#0d0c16] via-[#161425] to-[#1b1035]",
    accent: "bg-gradient-to-r from-[#ff33bb] to-[#36f3ff] text-black font-bold",
    card: "bg-gradient-to-tr from-[#ff33bb] via-[#36f3ff] to-[#3a80fe] text-white shadow-lg shadow-[#36f3ff]/25 border-none",
    border: "border-[#ff33bb]/30",
    text: "text-white",
    glow: "shadow-[#36f3ff]/30"
  },

  // Sunset: magenta, peach, orange with contrasting dark background
  sunset: {
    primary: "from-[#ff596a] via-[#fe8c66] to-[#fd89ff]",
    secondary: "from-[#221219] via-[#2f1424] to-[#291422]",
    background: "from-[#180e16] via-[#1c121e] to-[#191220]",
    accent: "bg-gradient-to-r from-[#ff6e60] to-[#fd89ff] text-[#311119] font-bold",
    card: "bg-gradient-to-tr from-[#ff596a] via-[#fe8c66] to-[#fd89ff] text-white shadow-lg shadow-[#fd89ff]/25 border-none",
    border: "border-[#ff596a]/30",
    text: "text-white",
    glow: "shadow-[#ff6e60]/30"
  },

  // Emerald: deep teal with glowing green/blue accents
  emerald: {
    primary: "from-[#0dffb5] via-[#1ecb9c] to-[#204ecd]",
    secondary: "from-[#122621] via-[#183931] to-[#153231]",
    background: "from-[#11241a] via-[#14482c] to-[#102b1e]",
    accent: "bg-gradient-to-r from-[#0dffb5] to-[#204ecd] text-black font-bold",
    card: "bg-gradient-to-tr from-[#0dffb5] via-[#2eecb8] to-[#204ecd] text-white shadow-lg shadow-[#0dffb5]/25 border-none",
    border: "border-[#43e97b]/40",
    text: "text-white",
    glow: "shadow-[#0dffb5]/25"
  },

  // Dark: high-contrast, modern true dark mode w/ strong card separation
  dark: {
    primary: "from-[#2f2743] to-[#323048]", // card gradients: purple-blue
    secondary: "from-[#17101e] via-[#17101e] to-[#19102a]",
    background: "from-[#111018] to-[#191024]",
    accent: "bg-gradient-to-r from-[#7f6fff] to-[#37b7fb] text-white font-bold",
    card: "bg-gradient-to-tr from-[#2f2743] via-[#323048] to-[#181824] text-white shadow-xl shadow-[#2f2743]/30 border-none",
    border: "border-[#322d44]/50",
    text: "text-white",
    glow: "shadow-[#322d44]/30"
  }
};

// All valid theme keys
const validThemes: Theme[] = [
  "ocean",
  "cosmic",
  "aurora",
  "sunset",
  "emerald",
  "neon",
  "dark"
];

export const getThemeColors = (theme: Theme) => {
  const themeColors = themes[theme];
  if (!themeColors) {
    console.warn(`Theme "${theme}" not found, falling back to ocean theme`);
    return themes.ocean;
  }
  return themeColors;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("examPrepTheme") as Theme;
    if (saved && validThemes.includes(saved)) {
      return saved;
    }
    // Prefer dark theme if user prefers, otherwise ocean
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "ocean";
  });

  useEffect(() => {
    // Clear invalid theme from localStorage if it exists
    const saved = localStorage.getItem("examPrepTheme") as Theme;
    if (saved && !validThemes.includes(saved)) {
      localStorage.removeItem("examPrepTheme");
    }
    localStorage.setItem("examPrepTheme", theme);

    // Toggle "dark" class on document for global Tailwind dark styles
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Optionally allow card backgrounds to adapt
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
