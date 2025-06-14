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

// Improved theme palettes
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
  // Cosmic: Deep purple, blue, and pink gradients for a "space" vibe
  cosmic: {
    primary: "from-purple-700 via-indigo-600 to-pink-500",
    secondary: "from-purple-100 via-indigo-100 to-pink-100",
    background: "from-purple-900 via-indigo-800 to-pink-700",
    accent: "bg-purple-100 text-purple-900",
    card: "bg-white/95 backdrop-blur-md border border-purple-200 text-gray-900",
    border: "border-purple-300",
    text: "text-purple-900",
    glow: "shadow-purple-400/50"
  },
  // Aurora: Green, yellow, violet—bright and uplifting
  aurora: {
    primary: "from-green-400 via-yellow-500 to-fuchsia-500",
    secondary: "from-green-100 via-yellow-100 to-pink-100",
    background: "from-green-300 via-yellow-200 to-fuchsia-300",
    accent: "bg-lime-100 text-lime-900",
    card: "bg-white/95 backdrop-blur-md border border-lime-200 text-gray-900",
    border: "border-lime-300",
    text: "text-lime-900",
    glow: "shadow-lime-300/50"
  },
  // Sunset: Peach, orange, pink, for a warm sunset gradient
  sunset: {
    primary: "from-orange-500 via-pink-500 to-yellow-400",
    secondary: "from-orange-100 via-pink-100 to-yellow-100",
    background: "from-yellow-200 via-orange-200 to-pink-200",
    accent: "bg-orange-100 text-orange-900",
    card: "bg-white/95 backdrop-blur-md border border-orange-200 text-gray-900",
    border: "border-orange-300",
    text: "text-orange-900",
    glow: "shadow-orange-300/50"
  },
  // Emerald: Lush teals, mint and green, calming for study
  emerald: {
    primary: "from-emerald-500 via-teal-500 to-lime-400",
    secondary: "from-emerald-50 via-teal-100 to-lime-100",
    background: "from-emerald-200 via-lime-200 to-teal-200",
    accent: "bg-emerald-100 text-emerald-900",
    card: "bg-white/95 backdrop-blur-md border border-emerald-200 text-gray-900",
    border: "border-emerald-300",
    text: "text-emerald-900",
    glow: "shadow-emerald-300/50"
  },
  // Neon: Modern blue and magenta with a nightlife vibe
  neon: {
    primary: "from-fuchsia-600 via-cyan-500 to-indigo-500",
    secondary: "from-fuchsia-50 via-cyan-50 to-indigo-50",
    background: "from-fuchsia-200 via-cyan-200 to-indigo-200",
    accent: "bg-fuchsia-100 text-fuchsia-900",
    card: "bg-white/95 backdrop-blur-md border border-fuchsia-200 text-gray-900",
    border: "border-fuchsia-300",
    text: "text-fuchsia-900",
    glow: "shadow-fuchsia-400/50"
  },
  // True dark theme
  dark: {
    primary: "from-slate-900 via-gray-900 to-neutral-800",
    secondary: "from-gray-800 via-gray-700 to-gray-600",
    background: "from-gray-900 via-neutral-900 to-zinc-900",
    accent: "bg-slate-700 text-gray-200",
    card: "bg-gray-900/95 backdrop-blur-md border border-gray-700 text-gray-100",
    border: "border-gray-800",
    text: "text-gray-100",
    glow: "shadow-cyan-600/40"
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
