
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'ocean' | 'forest' | 'aurora' | 'cosmic' | 'cyber' | 'neon';

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

const themes = {
  ocean: {
    primary: 'from-cyan-500 to-blue-600',
    secondary: 'from-cyan-50 via-blue-50 to-teal-50',
    background: 'from-cyan-100 via-blue-200 to-teal-300',
    accent: 'bg-cyan-100 text-cyan-900',
    card: 'bg-white/95 backdrop-blur-md border border-cyan-200 text-gray-900',
    border: 'border-cyan-300',
    text: 'text-cyan-900',
    glow: 'shadow-cyan-300/60'
  },
  forest: {
    primary: 'from-green-600 to-emerald-700',
    secondary: 'from-green-50 via-emerald-50 to-teal-50',
    background: 'from-green-200 via-emerald-300 to-teal-400',
    accent: 'bg-green-100 text-green-900',
    card: 'bg-white/95 backdrop-blur-md border border-green-200 text-gray-900',
    border: 'border-green-300',
    text: 'text-green-900',
    glow: 'shadow-green-300/60'
  },
  aurora: {
    primary: 'from-pink-500 to-violet-600',
    secondary: 'from-pink-50 via-purple-50 to-violet-50',
    background: 'from-pink-200 via-purple-300 to-violet-400',
    accent: 'bg-pink-100 text-pink-900',
    card: 'bg-white/95 backdrop-blur-md border border-pink-200 text-gray-900',
    border: 'border-pink-300',
    text: 'text-pink-900',
    glow: 'shadow-pink-300/60'
  },
  cosmic: {
    primary: 'from-indigo-600 to-blue-700',
    secondary: 'from-indigo-50 via-blue-50 to-sky-50',
    background: 'from-indigo-200 via-blue-300 to-sky-400',
    accent: 'bg-indigo-100 text-indigo-900',
    card: 'bg-white/95 backdrop-blur-md border border-indigo-200 text-gray-900',
    border: 'border-indigo-300',
    text: 'text-indigo-900',
    glow: 'shadow-indigo-300/60'
  },
  cyber: {
    primary: 'from-cyan-400 to-lime-400',
    secondary: 'from-cyan-50 via-lime-50 to-green-50',
    background: 'from-cyan-200 via-lime-300 to-green-400',
    accent: 'bg-cyan-100 text-cyan-900',
    card: 'bg-white/95 backdrop-blur-md border border-cyan-200 text-gray-900',
    border: 'border-cyan-300',
    text: 'text-cyan-900',
    glow: 'shadow-cyan-300/60'
  },
  neon: {
    primary: 'from-fuchsia-500 to-cyan-500',
    secondary: 'from-fuchsia-50 via-pink-50 to-cyan-50',
    background: 'from-fuchsia-200 via-pink-300 to-cyan-400',
    accent: 'bg-fuchsia-100 text-fuchsia-900',
    card: 'bg-white/95 backdrop-blur-md border border-fuchsia-200 text-gray-900',
    border: 'border-fuchsia-300',
    text: 'text-fuchsia-900',
    glow: 'shadow-fuchsia-300/60'
  }
};

const validThemes: Theme[] = ['ocean', 'forest', 'aurora', 'cosmic', 'cyber', 'neon'];

export const getThemeColors = (theme: Theme) => {
  const themeColors = themes[theme];
  if (!themeColors) {
    console.warn(`Theme "${theme}" not found, falling back to ocean theme`);
    return themes.ocean;
  }
  return themeColors;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('examPrepTheme') as Theme;
    // Check if the saved theme is valid, otherwise default to 'ocean'
    if (saved && validThemes.includes(saved)) {
      return saved;
    }
    return 'ocean';
  });

  useEffect(() => {
    // Clear invalid theme from localStorage if it exists
    const saved = localStorage.getItem('examPrepTheme') as Theme;
    if (saved && !validThemes.includes(saved)) {
      localStorage.removeItem('examPrepTheme');
    }
    localStorage.setItem('examPrepTheme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
