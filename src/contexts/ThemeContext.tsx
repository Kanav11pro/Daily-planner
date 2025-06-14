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

// Improved theme palettes (replacing everything but ocean with much more visually on-brand colors)
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

  // Cosmic: Deep violet-black background, prominent purple/pink, neon stars
  cosmic: {
    primary: "from-[#8743ff] via-[#4528e8] to-[#ed1cff]",
    secondary: "from-[#23102a] to-[#1a112a]",
    background: "from-[#17101f] via-[#1e1430] to-[#1b1023]",
    accent: "bg-[#8743ff]/90 text-white",
    card: "bg-[#23102a]/90 border border-[#8743ff]/30 text-white/90 backdrop-blur-sm",
    border: "border-[#8743ff]/40",
    text: "text-purple-100",
    glow: "shadow-[#d175fc]/30"
  },

  // Aurora: Bright neon rainbow, but on a deep dark base
  aurora: {
    primary: "from-[#ff42e6] via-[#00ddff] to-[#f9fd50]",
    secondary: "from-[#222835] via-[#29366a] to-[#34ecb8]",
    background: "from-[#14172b] via-[#18243a] to-[#1e2b38]",
    accent: "bg-gradient-to-r from-[#ff42e6] to-[#f9fd50] text-black font-bold",
    card: "bg-[#161a2a]/90 border border-[#f9fd50]/20 text-white/95 backdrop-blur-sm",
    border: "border-[#34ecb8]/40",
    text: "text-white",
    glow: "shadow-[#00ddff]/30"
  },

  // Sunset: Deep magenta, pink and golden orange 
  sunset: {
    primary: "from-[#ff61b6] via-[#ff6e60] to-[#fee140]",
    secondary: "from-[#291422] via-[#472a29] to-[#4c361e]",
    background: "from-[#1f1120] via-[#1b1423] to-[#281312]",
    accent: "bg-gradient-to-r from-[#ff6e60] to-[#fee140] text-[#311119] font-bold",
    card: "bg-[#291422]/95 border border-[#ff6e60]/30 text-white/95 backdrop-blur-sm",
    border: "border-[#ff61b6]/40",
    text: "text-white",
    glow: "shadow-[#ff6e60]/20"
  },

  // Emerald: Deep teal/cyan/green, luxurious emerald-glow
  emerald: {
    primary: "from-[#43e97b] via-[#38f9d7] to-[#007991]",
    secondary: "from-[#153231] via-[#224340] to-[#072928]",
    background: "from-[#0e181d] via-[#1e3838] to-[#12261e]",
    accent: "bg-gradient-to-r from-[#43e97b] to-[#007991] text-black font-bold",
    card: "bg-[#153231]/90 border border-[#43e97b]/30 text-white/90 backdrop-blur-sm",
    border: "border-[#43e97b]/40",
    text: "text-white",
    glow: "shadow-[#43e97b]/25"
  },

  // Neon: True dark base, magenta/blue/purple glow and gradients
  neon: {
    primary: "from-[#ff4edd] via-[#30cfff] to-[#838cff]",
    secondary: "from-[#17091c] via-[#07405f] to-[#2e1d45]",
    background: "from-[#080911] via-[#181435] to-[#1c122a]",
    accent: "bg-gradient-to-r from-[#30cfff] to-[#ff4edd] text-black font-bold",
    card: "bg-[#17091c]/90 border border-[#ff4edd]/20 text-white/95 backdrop-blur-sm",
    border: "border-[#30cfff]/25",
    text: "text-white",
    glow: "shadow-[#30cfff]/20"
  },

  // Dark (true dark mode, high contrast)
  dark: {
    primary: "from-[#232946] via-[#181823] to-[#121212]",
    secondary: "from-[#21212b] via-[#222232] to-[#171724]",
    background: "from-[#11111b] via-[#191926] to-[#15151d]",
    accent: "bg-[#353570] text-[#f2f2f2] font-bold",
    card: "bg-[#181823]/95 border border-[#232946]/50 text-[#f7f7fa] backdrop-blur-md",
    border: "border-[#353570]/25",
    text: "text-[#f7f7fa]",
    glow: "shadow-[#232946]/20"
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
